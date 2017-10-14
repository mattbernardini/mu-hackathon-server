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


module.exports.