import Joi from 'joi'
import bcrypt from 'bcrypt'
import isAuthenticated from '../auth/isAuthenticated'
import { checkEmailInUse } from './helpers'

/**
 * The editPerson Resolver edits a Person in the system.
 * @param {Object} root GraphQL Root Value
 * @param {Object} args GraphQL Request Arguments
 * @param {Object} context GraphQL Context Value
 */
const editPerson = async (root, args, context) => {
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const { Person } = db.get('MongooseModels')
  const { editPersonValidator } = db.get('fieldValidators')
  const session = Neo4J.session()
  const tx = session.beginTransaction()
  try {
    // VALIDATE
    isAuthenticated(context)
    const { error, value } = Joi.validate({
      ...args,
      person_email: args.person_email && args.person_email.toLowerCase(),
    }, editPersonValidator)
    if (error) {
      throw new Error('Field validation error.')
    }
    const { person_email, person_password } = value
    if (person_email) {
      const personExists = await checkEmailInUse(context, person_email)
      if (personExists) {
        throw new Error('An account with this email already exists.')
      }
    }

    // PREPARE EDITED PERSON
    const saltRounds = 10
    let encryptedPassword
    if (person_password) {
      encryptedPassword = await bcrypt.hash(person_password, saltRounds)
    }
    const timestamp = Date.now()

    // UPDATE PERSON IN NEO4J
    const personProps = {
      ...value,
      person_encryptedPassword: encryptedPassword,
      person_lastModified: timestamp,
    }
    const updateInNeo4j = await tx.run(`
      MATCH (p:Person)
      WHERE p.person_serialNumber = $personProps.person_serialNumber
      SET p += $personProps
      RETURN p AS person
    `, { personProps })
    if (updateInNeo4j.records.length !== 1) {
      throw new Error('Problem updating person record.')
    }
    const updatedFields = {
      ...updateInNeo4j.records[0].get('person').properties,
    }

    // UPDATE PERSON IN MONGO DB
    const updateInMongo = await Person.findOneAndUpdate(
      {
        person_serialNumber: personProps.person_serialNumber,
      },
      {
        $set: { ...updatedFields },
      },
    )
    if (!updateInMongo) {
      throw new Error('Something went wrong adding Person to Mongo DB.')
    }

    await tx.commit()
    session.close()
    return updatedFields
  } catch (e) {
    tx.rollback()
    session.close()
    throw e
  }
}

export default editPerson
