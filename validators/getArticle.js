import Joi from 'joi'

const getArticleValidator = {
  article_slug: Joi.string().required().min(4).max(512),
}

export default getArticleValidator
