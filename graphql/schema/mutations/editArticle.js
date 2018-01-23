import Joi from 'joi'
import generateSlug from 'slug'
import { checkSlugInUse } from './helpers'

/**
 * The editArticle Resolver edits an Article in the system.
 * FUTURE: Add metric for `edit strength` which is determined based on
 * the number of character changes positive/negative, etc.
 * @param {Object} root GraphQL Root Value
 * @param {Object} args GraphQL Request Arguments
 * @param {Object} context GraphQL Context Value
 */
const editArticle = async (root, args, context) => {
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const { Article } = db.get('MongooseModels')
  const { editArticleValidator } = db.get('fieldValidators')
  const session = Neo4J.session()
  const tx = session.beginTransaction()
  try {
    // VALIDATE FIELDS
    const { error, value } = Joi.validate({
      ...args,
    }, editArticleValidator)
    if (error) {
      throw new Error('Field validation error.')
    }
    const { article_title, article_oldSlug } = value
    let article_slug
    if (article_title) {
      article_slug = generateSlug(value.article_title)
      const slugExists = await checkSlugInUse(context, article_slug)
      if (slugExists) {
        throw new Error('An article with this title already exists.')
      }
    }
    const timestamp = Date.now()
    const articleProps = {
      ...value,
      article_slug: (!article_slug) ? article_oldSlug : article_slug,
      article_lastModified: timestamp,
      article_lastModifiedBy: value.article_editorSerialNumber,
      article_oldSlug: undefined,
    }

    // UPDATE ARTICLE IN NEO4J
    const updateInNeo4j = await tx.run(`
      MATCH (a:Article)
      WHERE a.article_slug = $article_oldSlug
      SET a += $articleProps
      RETURN a AS article
    `, { articleProps, article_oldSlug })
    if (updateInNeo4j.records.length !== 1) {
      throw new Error('Problem updating article record.')
    }
    const updatedFields = {
      ...updateInNeo4j.records[0].get('article').properties,
    }

    // LINK EDITOR IN NEO4J
    const createEditEvent = await tx.run(`
      MATCH (p:Person), (a:Article)
      WHERE p.person_serialNumber = $articleProps.article_lastModifiedBy
      AND a.article_slug = $articleProps.article_slug
      CREATE (p)-[r:EDITED {
        modifiedAt: $articleProps.article_lastModified
      }]->(a)
      RETURN p AS Person, r AS Edited, a AS Article
    `, { articleProps })
    if (createEditEvent.records.length !== 1) {
      throw new Error('Problem creating Edit Event for Article.')
    }

    // RE-LINK TAGS IN NEO4J
    if (args.article_tags) {
      const tags = args.article_tags.split(',')
      await tx.run(`
        MATCH (a:Article)-[r:RELATES_TO]-(t:Tag)
        WHERE a.article_slug = $articleProps.article_slug
        DELETE r
        RETURN t AS Tag
      `, { articleProps })
      const linkTags = await tx.run(`
        MATCH (a:Article)
        WHERE a.article_slug = $articleProps.article_slug
        UNWIND $tags AS newTag
        MERGE (a)-[r:RELATES_TO]->(t:Tag { tag_name: newTag })
        RETURN a AS Article, r AS Rel, t as Tag
      `, { articleProps, tags })
      if (linkTags.records.length !== tags.length) {
        throw new Error('Problem linking Tags to Article.')
      }
    }

    // UPDATE ARTICLE IN MONGO DB
    const updateInMongo = await Article.findOneAndUpdate(
      {
        article_slug: article_oldSlug,
      },
      {
        $set: { ...articleProps },
      },
    )
    if (!updateInMongo) {
      throw new Error('Something went wrong updating Article in Mongo DB.')
    }

    await tx.commit()
    session.close()
    return updatedFields
  } catch (e) {
    tx.rollback()
    session.close()
    throw e
  }
}

export default editArticle
