import Joi from 'joi'

const addArticleValidator = {
  article_status: Joi.string().required(), // TODO: make status an enum
  article_title: Joi.string().required().min(4).max(512),
  article_plainText: Joi.string().required().min(1).max(1000000),
  article_content: Joi.string().required().min(1).max(1000000),
  article_authorSerialNumber: Joi.string().required().min(20).max(64),
  article_tags: Joi.string().required().min(4).max(64),
}

export default addArticleValidator
