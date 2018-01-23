import isAuthenticated from '../../auth/isAuthenticated'

/**
 * The getTags Sub-field Resolver gets the Tags linked to the specified Article.
 * @param {Object} root GraphQL Root Value
 * @param {Object} args GraphQL Request Arguments
 * @param {Object} context GraphQL Context Value
 */
const getTags = async (root, args, context) => {
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const session = Neo4J.session()
  try {
    isAuthenticated(context)

    // GET ARTICLE AUTHOR FROM NEO4J
    const result = await session.run(`
      MATCH (a:Article)-[r:RELATES_TO]->(t:Tag)
      WHERE a.article_slug = $root.article_slug
      RETURN t AS Tag
    `, { root })
    session.close()
    const tags = result.records.map(tag => ({
      ...tag.get('Tag').properties,
    }))
    return tags
  } catch (e) {
    throw e
  }
}

export default getTags
