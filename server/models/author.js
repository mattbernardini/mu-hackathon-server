const mongoose = require('mongoose')

const authorSchema = mongoose.Schema({
  name: {
    type: String
  },
  domains: [{
    type: String
  }],
  tags: [{
    name: String,
    count: Number,
    ssr: Number
  }],
  articles: [{
    url: String,
    editor: String,
    pubDate: Date,
    tags: String,
    domains: String,
    author: String
  }]
})

const Author = module.exports = mongoose.model('Author', authorSchema)

module.exports.addAuthor = function (newAuthor, callback) {
  newAuthor.save(callback)
}

module.exports.updateAuthor = function (_id, updatedAuthor, callback) {
  console.log(updatedAuthor)
  Author.findByIdAndUpdate({_id}, updatedAuthor, callback)
}

module.exports.deleteAuthor = function (_id, callback) {
  Author.findByIdAndRemove(_id, callback)
}
