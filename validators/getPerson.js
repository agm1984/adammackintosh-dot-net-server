import Joi from 'joi'

const getPersonValidator = {
  person_serialNumber: Joi.string().required().min(20).max(64),
}

export default getPersonValidator
