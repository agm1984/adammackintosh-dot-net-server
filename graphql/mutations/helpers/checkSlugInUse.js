/**
 * The checkSlugInUse helper method checks if an Email Address is currently in use.
 * FUTURE: rather than reject the new post if a slug is in use,
 * add a number to the end of the slug to prevent collisions.
 * @param {*} context GraphQL Context Value
 * @param {String} slug
 */
const checkSlugInUse = async (context, slug) => {
  if (!slug) {
    throw new Error('Invalid slug.')
  }
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const session = Neo4J.session()
  try {
    const result = await session.run(`
      MATCH (a:Article)
      WHERE a.slug = $slug
      RETURN count(a) AS slugInUse
    `, { slug })
    session.close()
    const exists = result.records[0].get('slugInUse').low
    if ([0, 1].indexOf(exists) === -1) {
      throw new Error('Problem checking if Slug is in use.')
    }
    if (exists) {
      return true
    }
    return false
  } catch (e) {
    session.close()
    throw e
  }
}

export default checkSlugInUse
