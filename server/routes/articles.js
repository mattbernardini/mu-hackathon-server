const express = require('express')
const router = new express.Router()
const Article = require('../models/article')

router.patch('/', (req, res) => {
  console.log('PATCH /articles/')
  console.log(req.body)

  var updatedArticle = {...req.body}

  Article.updateAuthor(req.body._id, updatedArticle, (err) => {
    if (err) {
      console.log(err)
      res.json({success: false, msg: 'Error occured, fialed to update '})
      console.log('Error occured, fialed to update.')
    } else {
      res.json({success: true, msg: 'Updated '})
      console.log('Updated')
    }
  })
})

router.get('/', (req, res) => {
  console.log('GET /articles')
  console.log(req.query)
  const qs = new MongoQS({
    custom: {
      urlQueryParamName: function (query, input) {
        query['url'] = input.url
        query['editor'] = input.editor
        query['pubDate'] = input.pubDate
        query['tags'] = input.tags
        query['domains'] = input.author
      }
    }
  })
  const query = qs.parse(req.query)
  Article.find(query, (err, article2) => {
    if (err) {
      console.log(err)
      return res.status(500).json({errors: {message: 'Error occured'}})
    }
    let articles = []
    _.forEach(article2, function (u) {
      articles.push(prep.prepForSend(u))
    })
    res.json({articles})
  })
})
const MongoQS = require('mongo-querystring')

module.exports = router
