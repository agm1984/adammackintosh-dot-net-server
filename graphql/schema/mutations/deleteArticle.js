/**
 * Deleting is not currently supporting, but it should look roughly like this,
 * but with field validation as well.
 * @param {Object} root GraphQL Root Value
 * @param {Object} args GraphQL Request Arguments
 * @param {Object} context GraphQL Context Value
 */
const deleteArticle = async (root, args, context) => {
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const session = Neo4J.session()
  const tx = session.beginTransaction()
  try {
    const { article_slug } = args
    const neo4jDelete = await tx.run(`
      MATCH (a:Article)
      WHERE a.article_slug = $article_slug
      DETACH DELETE a
      RETURN a AS Article
    `, { article_slug })
    if (neo4jDelete.records.length !== 1) {
      throw new Error('Problem deleting Article.')
    }
    await tx.commit()
    session.close()
    return
  } catch (e) {
    tx.rollback()
    session.close()
    throw e
  }
}

export default deleteArticle
