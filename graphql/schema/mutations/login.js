import Joi from 'joi'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getPersonByEmail } from './helpers'

/**
 * The login Resolver signs a Person into the system.
 * @param {Object} root GraphQL Root Value
 * @param {Object} args GraphQL Request Arguments
 * @param {Object} context GraphQL Context Value
 */
const login = async (root, args, context) => {
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const { loginValidator } = db.get('fieldValidators')
  const session = Neo4J.session()
  try {
    // VALIDATE FIELDS
    const { error, value } = Joi.validate({
      person_email: args.person_email.toLowerCase(),
      person_password: args.person_password,
    }, loginValidator)
    if (error) {
      throw new Error('Field validation error.')
    }
    const {
      person_encryptedPassword, person_serialNumber,
    } = await getPersonByEmail(context, value.person_email)
    // CHECK PASSWORD
    const validPassword = await bcrypt.compare(value.person_password, person_encryptedPassword)
    if (!validPassword) {
      throw new Error('Authentication failed.')
    }
    const token = jwt.sign(
      {
        person: person_serialNumber,
      },
      context.settings.SECRET,
      {
        expiresIn: '1y',
      },
    )
    return token
  } catch (e) {
    session.close()
    throw e
  }
}

export default login
