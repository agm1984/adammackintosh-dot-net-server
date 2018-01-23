import Joi from 'joi'
import generateSlug from 'slug'
import { checkAuthorExists, checkSlugInUse } from './helpers'

/**
 * The addArticle Resolver creates and adds a new Article to the system.
 * @param {Object} root GraphQL Root Value
 * @param {Object} args GraphQL Request Arguments
 * @param {Object} context GraphQL Context Value
 */
const addArticle = async (root, args, context) => {
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const { Article } = db.get('MongooseModels')
  const { addArticleValidator } = db.get('fieldValidators')
  const session = Neo4J.session()
  const tx = session.beginTransaction()
  let mongoSuccess
  try {
    // VALIDATE FIELDS
    const { error, value } = Joi.validate({
      article_status: args.article_status,
      article_title: args.article_title,
      article_plainText: args.article_plainText,
      article_content: args.article_content,
      article_authorSerialNumber: args.article_authorSerialNumber,
      article_tags: args.article_tags,
    }, addArticleValidator)
    if (error) {
      throw new Error('Field validation error.')
    }
    const article_slug = generateSlug(value.article_title)
    const slugExists = await checkSlugInUse(context, article_slug)
    if (slugExists) {
      throw new Error('An article with this title already exists.')
    }
    const validAuthor = await checkAuthorExists(context, args.article_authorSerialNumber)
    if (!validAuthor) {
      throw new Error('Author is invalid.')
    }
    const {
      article_status,
      article_title,
      article_plainText,
      article_content,
      article_authorSerialNumber,
    } = value
    const article_tags = value.article_tags.split(',')
    const article_created = Date.now()
    const newArticle = {
      article_status,
      article_title,
      article_slug,
      article_plainText,
      article_content,
      article_created,
      article_authorSerialNumber,
    }

    // CREATE ARTICLE IN MONGO DB
    mongoSuccess = await Article.create({ ...newArticle })
    if (!mongoSuccess) {
      throw new Error('Failed to write Article to Mongo DB.')
    }

    // CREATE ARTICLE IN NEO4J
    const neoArticle = await tx.run(`
      CREATE (a:Article)
      SET a += $newArticle
      RETURN a AS Article
    `, { newArticle })
    if (neoArticle.records.length !== 1) {
      throw new Error('Problem creating new Article in Neo4j.')
    }
    const initialFields = {
      ...neoArticle.records[0].get('Article').properties,
    }

    // LINK AUTHOR IN NEO4J
    const linkAuthorInNeo4j = await tx.run(`
      MATCH (p:Person), (a:Article)
      WHERE p.person_serialNumber = $initialFields.article_authorSerialNumber
      AND a.article_slug = $initialFields.article_slug
      CREATE (p)-[r:CONTRIBUTED { created: $initialFields.article_created }]->(a)
      RETURN p AS Person, r AS Contributed, a AS Article
    `, { initialFields })
    if (linkAuthorInNeo4j.records.length !== 1) {
      throw new Error(`Problem linking Author (${initialFields.article_authorSerialNumber}) to new Article in Neo4j.`)
    }

    // LINK TAGS IN NEO4J
    await tx.run(`
      MATCH (p:Person), (a:Article)
      WHERE p.person_serialNumber = $initialFields.article_authorSerialNumber
      AND a.article_slug = $initialFields.article_slug
      UNWIND $article_tags AS tag
      MERGE (t:Tag { tag_name: tag })
      CREATE (a)-[r:RELATES_TO]->(t)
      RETURN p AS Person, a AS Article, r AS Relates, t AS Tag
    `, { initialFields, article_tags })
    const finalFields = {
      ...initialFields,
    }
    await tx.commit()
    return finalFields
  } catch (e) {
    console.log('ERROR', e)
    await Article.findByIdAndRemove({ _id: mongoSuccess._id })
    tx.rollback()
    session.close()
    throw e
  }
}

export default addArticle
