const express = require('express')
const router = new express.Router()
const Article = require('../models/article')
const MongoQS = require('mongo-querystring')
const HTMLParser = require('fast-html-parser')
const curl = require('curl')
const _ = require('lodash')
const prep = require('../help/prepForSend')
const Author = require('../models/author')
const Domain = require('../models/Domain')

router.post('/', (req, res) => {
  console.log(req.body)
  curl.get(req.body.url, (err, body) => {
    if (!_.isEmpty(err)) {
      console.log(err)
      return res.status(500).json({errors: {message: 'Error occured'}})
    }
    // Parse the HTML for info
    let article = new Article()
    console.log(body)
    console.log(body.request.host)
    const host = body.request.host
    const dom = HTMLParser.parse(body.body)
    article.title = dom.querySelector('h1')
    // Check for Domain existance
    const fd = Domain.findOne({name: host}, (err, foundDomain) => {
      if (!_.isEmpty(err)) {
        console.log(err)
        return res.status(500).json({errors: {message: 'Error occured'}})
      }
      if (_.isEmpty(foundDomain)) {
        // Create new domain
      }
      // Grab id
      console.log('found domain')
      callback(foundDomain)
    })
  //  console.log(fd.schema.tree.name())
    console.log('here')
    res.sendStatus(200)
  })

  return res.status(200)
})

router.patch('/', (req, res) => {
  console.log('PATCH /articles/')
  console.log(req.body)

  var updatedArticle = (req.body)

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
