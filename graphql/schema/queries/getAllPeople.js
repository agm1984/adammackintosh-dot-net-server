import { isAuthenticated } from '../../auth/isAuthenticated'

/**
 * The allPeople Resolver gets the details of the specified Person,
 * looked up by email address.
 * @param {Object} root GraphQL Root Value
 * @param {Object} args GraphQL Request Arguments
 * @param {Object} context GraphQL Context Value
 */
const allPeople = async (root, args, context) => {
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const session = Neo4J.session()
  try {
    isAuthenticated(context)
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

export default allPeople
