import mongoose from 'mongoose'

const articleSchema = new mongoose.Schema({
  article_authorSerialNumber: String,
  article_status: String,
  article_title: String,
  article_slug: String,
  article_plainText: String,
  article_content: String,
  article_created: String,
  article_lastModified: String,
  article_lastModifiedBy: String,
})

export default mongoose.model('Article', articleSchema)
