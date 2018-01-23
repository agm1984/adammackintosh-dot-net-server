import isAuthenticated from '../auth/isAuthenticated'

/**
 * The getAllPeople Resolver gets the details of all People in Neo4j.
 * @param {Object} root GraphQL Root Value
 * @param {Object} args GraphQL Request Arguments
 * @param {Object} context GraphQL Context Value
 */
const getAllArticles = async (root, args, context) => {
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const session = Neo4J.session()
  try {
    isAuthenticated(context)

    // GET ARTICLES FROM NEO4J
    const result = await session.run(`
      MATCH (a:Article)
      RETURN a AS article
    `)
    session.close()
    const articles = result.records.map(article => ({
      ...article.get('article').properties,
    }))
    return articles
  } catch (e) {
    session.close()
    throw e
  }
}

export default getAllArticles
