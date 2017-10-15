const express = require('express')
const router = new express.Router()
const Article = require('../models/article')
const MongoQS = require('mongo-querystring')
const HTMLParser = require('fast-html-parser')
const curl = require('curl')
const _ = require('lodash')
const prep = require('../help/prepForSend')
const Author = require('../models/author')
const Domain = require('../models/domain')
const User = require('../models/user')

router.post('/', (req, res) => {
  curl.get(req.body.url, (err, body) => {
    if (!_.isEmpty(err)) {
      console.log(err)
      return res.status(500).json({errors: {message: 'Error occured'}})
    }
    // Parse the HTML for info
    var domain
    var author
    var article = new Article()
    var user
    const host = body.request.host
    let tempArray = []
    _.forEach(req.body.tags, (tag) => {
      tempArray.push({name: tag, user: req.body.id})
    })
    article.tags = tempArray
    article.url = req.body.url
    const dom = HTMLParser.parse(body.body)
    article.title = dom.querySelector('h1')
    // Check for Domain existance
    User.findOne({_id: req.body.id}, (err, foundUser) => {
      if (!_.isEmpty(err)) {
        console.log(err)
        return res.status(500).json({errors: {message: 'Error occured'}})
      }
      user = foundUser
      Domain.findOne({name: host}, (err, foundDomain) => {
        if (!_.isEmpty(err)) {
          console.log(err)
          return res.status(500).json({errors: {message: 'Error occured'}})
        }
        if (_.isEmpty(foundDomain)) {
          // Create new domain
          console.log('hereeeeeeeeeeeee')
          domain = Domain.addDomain(host)
          console.log(domain)
        } else {
          domain = foundDomain
          console.log('found domain')
        }
        article.domain = domain._id
        Author.findOne({name: req.body.author}, (err, foundAuthor) => {
          if (!_.isEmpty(err)) {
            console.log(err)
            return res.status(500).json({errors: {message: 'Error occured'}})
          }
          if (_.isEmpty(foundAuthor)) {
            // Create new author logic
            author = new Author({name: req.body.author})
          } else {
            author = foundAuthor
          }

          article.author.push(author._id)
          // Add article
          author.articles.push(article._id)
          _.forEach(req.body.tags, (tag) => {
            let tagCheck = false
            _.forEach(author.tags, (iTag) => {
              if (tag === iTag) {
                iTag.count++
                tagCheck = true
              }
            })
            if (!tagCheck) {
              // If we didnt find the tag
              author.tags.push({name: tag, count: 1, snr: 0})
            }
          })
          // Check domains
          let domainCheck = false
          _.forEach(author.domains, (iDomain) => {
            if (iDomain === domain._id) {
              domainCheck = true
            }
          })
          if (!domainCheck) {
            author.domains.push(domain._id)
          }
          domain.author.push(author._id)
          domain.article.push(article._id)
          user.articles.push(article._id)
          console.log(user)
          console.log(article)
          console.log(domain)
          console.log(author)
          res.sendStatus(200)
        })
      })
    })
  })
})

router.patch('/', (req, res) => {
  console.log('PATCH /articles/')
  console.log(req.body)

  var newTags = (req.body)

  Article.updateArticle(req.body._id, newTags, (err) => {
    if (err) {
      console.log(err)
      res.json({success: false, msg: 'Error occured, failed to update '})
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
