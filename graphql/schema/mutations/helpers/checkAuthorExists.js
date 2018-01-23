/**
 * The checkAuthorExists helper method checks if the specified Person's
 * Serial Number is valid.
 * @param {*} context GraphQL Context Value
 * @param {String} serial Serial Number for the Person
 */
const checkAuthorExists = async (context, serial) => {
  if (!serial) {
    throw new Error('Invalid Serial Number.')
  }
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const session = Neo4J.session()
  try {
    const result = await session.run(`
      MATCH (p:Person)
      WHERE p.person_serialNumber = $serial
      RETURN count(p) AS authorExists
    `, { serial })
    session.close()
    const exists = result.records[0].get('authorExists').low
    if ([0, 1].indexOf(exists) === -1) {
      throw new Error('Problem checking if author exists.')
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

export default checkAuthorExists
