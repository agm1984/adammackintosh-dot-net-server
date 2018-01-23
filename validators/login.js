import Joi from 'joi'

const loginValidator = {
  person_email: Joi.string().required().email({
    errorLevel: 64,
    minDomainAtoms: 2,
  }).min(6),
  person_password: Joi.string().required().min(4).max(64),
}

export default loginValidator
