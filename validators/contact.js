import Joi from 'joi'

const registerValidator = {
  message_subject: Joi.string().required(),
  message_content: Joi.string().max(2000).required(),
  message_senderName: Joi.string().required(),
  message_senderEmail: Joi.string().required(),
}

export default registerValidator
