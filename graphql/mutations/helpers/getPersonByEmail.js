/**
 * The getPersonByEmail helper method retrieves a Person
 * by his/her email address.
 * @param {*} context GraphQL Context Value
 * @param {*} email Email address of the person signing in
 */
const getPersonByEmail = async (context, email) => {
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const session = Neo4J.session()
  try {
    const person = await session.run(`
      MATCH (p:Person)
      WHERE p.person_email = $email
      RETURN p AS person
    `, { email })
    session.close()
    if (person.records.length !== 1) {
      throw new Error('Person not found.')
    }
    return {
      ...person.records[0].get('person').properties,
    }
  } catch (e) {
    throw e
  }
}

export default getPersonByEmail
