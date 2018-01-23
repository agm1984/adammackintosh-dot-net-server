const getAllArticles = async (root, args, context) => {
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const session = Neo4J.session()
  try {
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
