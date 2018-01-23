/**
 * The checkEmailInUse helper method checks if an Email Address is currently in use.
 * @param {*} context GraphQL Context Value
 * @param {String} email
 */
const checkEmailInUse = async (context, email) => {
  if (!email) {
    throw new Error('Invalid email.')
  }
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const session = Neo4J.session()
  try {
    const result = await session.run(`
      MATCH (p:Person)
      WHERE p.person_email = $email
      RETURN count(p) AS emailInUse
    `, { email })
    session.close()
    const exists = result.records[0].get('emailInUse').low
    if ([0, 1].indexOf(exists) === -1) {
      throw new Error('Problem checking if email is in use.')
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

export default checkEmailInUse
