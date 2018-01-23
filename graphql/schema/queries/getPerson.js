import Joi from 'joi'

/**
 * The getPerson Resolver gets the details of the specified Person,
 * looked up by email address.
 * @param {Object} root GraphQL Root Value
 * @param {Object} args GraphQL Request Arguments
 * @param {Object} context GraphQL Context Value
 */
const getPerson = async (root, args, context) => {
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const session = Neo4J.session()
  try {
    // VALIDATE FIELDS
    const schema = {
      person_serialNumber: Joi.string().required().min(20).max(64),
    }
    const { error, value } = Joi.validate({
      person_serialNumber: args.person_serialNumber,
    }, schema)
    if (error) {
      throw new Error('Field validation error.')
    }
    const serialNumber = value.person_serialNumber
    // GET PERSON FROM NEO4J
    const person = await session.run(`
      MATCH (p:Person)
      WHERE p.person_serialNumber = $serialNumber
      RETURN p AS person
    `, { serialNumber })
    session.close()
    if (person.records.length !== 1) {
      throw new Error('Person not found.')
    }
    return {
      ...person.records[0].get('person').properties,
    }
  } catch (e) {
    session.close()
    throw e
  }
}

export default getPerson
