import Joi from 'joi'

const editPersonValidator = {
  person_serialNumber: Joi.string().required().min(20).max(64),
  person_status: Joi.string(),
  person_memberType: Joi.string(),
  person_canBeEmailed: Joi.boolean(),
  person_avatar: Joi.string().uri().min(8).max(256),
  person_givenName: Joi.string().min(2).max(64),
  person_familyName: Joi.string().min(2).max(64),
  person_email: Joi.string().email({
    errorLevel: 64,
    minDomainAtoms: 2,
  }).min(6),
  person_tel: Joi.string().min(10).max(10),
  person_gender: Joi.string(),
  person_birthday: Joi.string(),
  person_location: Joi.string(),
  person_bio: Joi.string().max(2000),
  person_password: Joi.string().min(4).max(64),
}

export default editPersonValidator
