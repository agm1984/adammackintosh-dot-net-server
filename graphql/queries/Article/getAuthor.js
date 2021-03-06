import isAuthenticated from '../../auth/isAuthenticated'

/**
 * The getAuthor Sub-field Resolver gets the Author linked to the specified Article.
 * @param {Object} root GraphQL Root Value
 * @param {Object} args GraphQL Request Arguments
 * @param {Object} context GraphQL Context Value
 */
const getAuthor = async (root, args, context) => {
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const session = Neo4J.session()
  try {
    // VALIDATE
    const hasAuth = isAuthenticated(context)
    if (!hasAuth) {
      throw new Error('You must be authenticated to run this query.')
    }

    // GET ARTICLE AUTHOR FROM NEO4J
    const result = await session.run(`
      MATCH (p:Person)-[r:CONTRIBUTED]->(a:Article)
      WHERE a.article_slug = $root.article_slug
      RETURN p AS Person
    `, { root })
    session.close()
    if (result.records.length !== 1) {
      // throw new Error(`Failed to get Author for Article: ${root.slug}`)
      return false
    }
    return {
      ...result.records[0].get('Person').properties,
    }
  } catch (e) {
    session.close()
    throw e
  }
}

export default getAuthor
