const mongoose = require('mongoose')

const articleSchema = mongoose.Schema({
  url: {
    type: String,
    unique: true
  },
  editor: {
    type: String
  },
  title: {
    type: String
  },
  pubDate: {
    type: Date
  },
  tags: [{
    name: String,
    user: String
  }],
  domains: {
    type: String
  },
  author: [{
    type: String
  }]
})

const Article = module.exports = mongoose.model('Article', articleSchema)

module.exports.addArticle = function (newArticle, callback) {
  newArticle.save(callback)
}

module.exports.updateArticle = function (_id, updatedArticle, callback) {
  console.log(updatedArticle)
  Article.findByIdAndUpdate({_id}, updatedArticle, callback)
}

module.exports.deleteArticle = function (_id, callback) {
  Article.findByIdAndRemove(_id, callback)
}
