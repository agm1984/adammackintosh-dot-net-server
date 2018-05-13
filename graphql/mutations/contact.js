import Joi from 'joi'

/**
 * The Contact Resolver allows a Contact Form message to be sent to the server.
 *
 * Note: Storing a Contact Message blob in Neo4j is anti-pattern, but it is
 * not a hazard until the server scales more.
 * @param {Object} root GraphQL Root Value
 * @param {Object} args GraphQL Request Arguments
 * @param {Object} context GraphQL Context Value
 */
const contact = async (root, args, context) => {
  const { db } = context
  const Neo4J = db.get('Neo4J')
  const { contactValidator } = db.get('fieldValidators')
  const session = Neo4J.session()
  const tx = session.beginTransaction()
  try {
    // VALIDATE
    const { error, value } = Joi.validate({
      ...args,
      message_subject: args.message_subject,
      message_content: args.message_content,
      message_senderName: args.message_senderName,
      message_senderEmail: args.message_senderEmail,
    }, contactValidator)
    if (error) {
      throw new Error('Field validation error.')
    }

    // CREATE MESSAGE IN NEO4J
    const messageProps = {
      ...value,
      message_created: Date.now(),
    }
    const createInNeo4j = await tx.run(`
      CREATE (m:Message $messageProps)
      RETURN m AS message
    `, { messageProps })
    const completedFields = {
      message_id: createInNeo4j.records[0].get('message').identity.low,
      ...createInNeo4j.records[0].get('message').properties,
    }

    await tx.commit()
    session.close()

    return {
      ...completedFields,
    }
  } catch (e) {
    tx.rollback()
    session.close()
    throw e
  }
}

export default contact
