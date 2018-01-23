import Joi from 'joi'

const editArticleValidator = {
  article_editorSerialNumber: Joi.string().required().min(20).max(64),
  article_oldSlug: Joi.string().required().min(4).max(512),
  article_status: Joi.string(), // TODO: make status an enum
  article_title: Joi.string().min(4).max(512),
  article_plainText: Joi.string().min(1).max(1000000),
  article_content: Joi.string().min(1).max(1000000),
  article_tags: Joi.string().min(4).max(64),
}

export default editArticleValidator
