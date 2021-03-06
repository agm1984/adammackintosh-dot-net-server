import Joi from 'joi'
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import isAuthenticated from '../auth/isAuthenticated'
import { checkEmailInUse } from './helpers'

/**
 * The addPerson Resolver creates and adds a new Person to the system.
 * @param {Object} root GraphQL Root Value
 * @param {Object} args GraphQL Request Arguments
 * @param {Object} context GraphQL Context Value
 */
const addPerson = async (root, args, context) => {
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const { Person } = db.get('MongooseModels')
  const { addPersonValidator } = db.get('fieldValidators')
  const session = Neo4J.session()
  const tx = session.beginTransaction()
  try {
    // VALIDATE
    const hasAuth = isAuthenticated(context)
    if (!hasAuth) {
      throw new Error('You must be authenticated to run this query.')
    }
    let email
    if (args.person_email) {
      email = args.person_email.toLowerCase()
    }
    const { error, value } = Joi.validate({
      ...args,
      person_email: email,
    }, addPersonValidator)
    if (error) {
      throw new Error('Field validation error.')
    }
    const { person_email, person_password } = value
    const personExists = await checkEmailInUse(context, person_email)
    if (personExists) {
      throw new Error('An account with this email already exists.')
    }

    // PREPARE NEW PERSON
    const saltRounds = 10
    const encryptedPassword = await bcrypt.hash(person_password, saltRounds)
    const serialNumber = uuid().split('-').join('')
    const timestamp = Date.now()

    // CREATE PERSON IN NEO4J
    const personProps = {
      ...value,
      person_encryptedPassword: encryptedPassword,
      person_created: timestamp,
    }
    const createInNeo4j = await tx.run(`
      CREATE (p:Person $personProps)
      RETURN p AS person
    `, { personProps })
    const initialFields = {
      person_id: createInNeo4j.records[0].get('person').identity.low,
      ...createInNeo4j.records[0].get('person').properties,
    }
    const finishInNeo4j = await tx.run(`
      MATCH (p:Person)
      WHERE id(p) = toInteger($initialFields.person_id)
      SET p.person_serialNumber = $serialNumber, p.person_status = 'Active'
      RETURN p AS person
    `, { initialFields, serialNumber })
    const completedFields = {
      ...initialFields,
      ...finishInNeo4j.records[0].get('person').properties,
    }
    if (completedFields.person_serialNumber !== serialNumber) {
      throw new Error('Unable to create new person, serial number mismatch.')
    }

    // CREATE PERSON IN MONGO DB
    const createInMongo = await Person.create({ ...completedFields })
    if (!createInMongo) {
      throw new Error('Something went wrong adding Person to Mongo DB.')
    }

    await tx.commit()
    session.close()
    return completedFields
  } catch (e) {
    tx.rollback()
    session.close()
    throw e
  }
}

export default addPerson
