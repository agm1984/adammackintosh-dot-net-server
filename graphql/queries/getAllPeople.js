import isAuthenticated from '../auth/isAuthenticated'

/**
 * The getAllPeople Resolver gets the details of all People in Neo4j.
 * @param {Object} root GraphQL Root Value
 * @param {Object} args GraphQL Request Arguments
 * @param {Object} context GraphQL Context Value
 */
const getAllPeople = async (root, args, context) => {
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const session = Neo4J.session()
  try {
    isAuthenticated(context)

    // GET PEOPLE FROM NEO4J
    const result = await session.run(`
      MATCH (p:Person)
      RETURN p AS singlePerson
    `)
    session.close()
    const people = result.records.map(person => ({
      ...person.get('singlePerson').properties,
    }))
    return people
  } catch (e) {
    session.close()
    throw e
  }
}

export default getAllPeople
