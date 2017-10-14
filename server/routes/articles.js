const express = require('express')
const router = new express.Router()
const Article = require('../models/article')
const MongoQS = require('mongo-querystring')
const HTMLParser = require('fast-html-parser')
const curl = require('curl')
const _ = require('lodash')

router.post('/', (req, res) => {
  console.log(req.body)
  curl.get(req.body.url, (err, body) => {
    if (!_.isEmpty(err)) {
      console.log(err)
      return res.status(500).json({errors: {message: 'Error occured'}})
    }
    console.log(body)
    console.log(body.request.host)
    const host = body.request.host
    const dom = HTMLParser.parse(body.body)
    const h1 = dom.querySelector('h1')
    console.log(h1)
    let auth = {}
    switch (host) {
      case 'www.foxnews.com':
        auth = dom.querySelector('.author-byline span a')
        break
      case 'money.cnn.com':
        auth = dom.querySelector('.byline')
    }
    if (_.isEmpty(auth)) {

    }
    console.log(auth)
  })
  return res.status(200)
})

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

module.exports = router
