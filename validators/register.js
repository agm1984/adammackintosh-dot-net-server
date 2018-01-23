import Joi from 'joi'

const registerValidator = {
  person_status: Joi.string().required(),
  person_memberType: Joi.string().required(),
  person_canBeEmailed: Joi.boolean(),
  person_avatar: Joi.string().uri().min(8).max(256),
  person_givenName: Joi.string().required().min(2).max(64),
  person_familyName: Joi.string().required().min(2).max(64),
  person_email: Joi.string().required().email({
    errorLevel: 64,
    minDomainAtoms: 2,
  }).min(6),
  person_tel: Joi.string().min(10).max(10),
  person_gender: Joi.string(),
  person_birthday: Joi.string(),
  person_location: Joi.string(),
  person_bio: Joi.string().max(2000),
  person_password: Joi.string().required().min(4).max(64),
}

export default registerValidator
