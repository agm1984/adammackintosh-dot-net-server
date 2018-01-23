import Joi from 'joi'
import isAuthenticated from '../auth/isAuthenticated'

/**
 * The getArticle Resolver gets the details of the specified Article,
 * looked up by slug.
 * @param {Object} root GraphQL Root Value
 * @param {Object} args GraphQL Request Arguments
 * @param {Object} context GraphQL Context Value
 */
const getArticle = async (root, args, context) => {
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const { getArticleValidator } = db.get('fieldValidators')
  const session = Neo4J.session()
  try {
    // VALIDATE
    isAuthenticated(context)
    const { error, value } = Joi.validate({
      article_slug: args.article_slug,
    }, getArticleValidator)
    if (error) {
      throw new Error('Field validation error.')
    }
    const slug = value.article_slug

    // GET ARTICLE FROM NEO4J
    const article = await session.run(`
    MATCH (a:Article)
    WHERE a.article_slug = $slug
    RETURN a AS article
  `, { slug })
    session.close()
    if (article.records.length !== 1) {
      throw new Error('Article not found.')
    }
    return {
      ...article.records[0].get('article').properties,
    }
  } catch (e) {
    session.close()
    throw e
  }
}

export default getArticle
