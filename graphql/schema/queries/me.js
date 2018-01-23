import { isAuthenticated } from '../../auth/isAuthenticated'

/**
 * The me Resolver gets the details of the currently signed in Person.
 * @param {Object} root GraphQL Root Value
 * @param {Object} args GraphQL Request Arguments
 * @param {Object} context GraphQL Context Value
 */
const me = async (root, args, context) => {
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const session = Neo4J.session()
  try {
    isAuthenticated(context)
    const { person } = context
    const result = await session.run(`
      MATCH (p:Person)
      WHERE p.person_serialNumber = '${person}'
      RETURN p AS person
    `, { person })
    session.close()
    if (result.records.length !== 1) {
      throw new Error('Person not found.')
    }
    return {
      ...result.records[0].get('person').properties,
    }
  } catch (e) {
    session.close()
    throw e
  }
}

export default me
