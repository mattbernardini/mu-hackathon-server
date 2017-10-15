const express = require('express')
const router = new express.Router()
const Article = require('../models/article')
const MongoQS = require('mongo-querystring')
const HTMLParser = require('fast-html-parser')
const errors = require('../help/errors')
const curl = require('curl')
const _ = require('lodash')
const prep = require('../help/prepForSend')
const Author = require('../models/author')
const Domain = require('../models/domain')
const User = require('../models/user')
/**
 * @api {post} /articles Requests for accessing articles data
 * @apiSampleRequest https://mu-hackathon.herokuapp.com/articles
 * @apiName PostArticles
 * @apiGroup Article
 * 
 * @apiParam {String} url URL of the article to add
 * @apiParam {String} author Name of the author to attribute the article
 * @apiParam {String} id Id of the user that is adding the article
 * @apiParam {Array} tags An array of strings consisting of the tags the user wants to add to the article
 * 
 * @apiSuccess {String} url Url of the article
 * @apiSuccess {String} id Mongo ID of the object
 * @apiSuccess {String} title Title of the article
 * @apiSuccess {Array} tags An array of tags, associated with the user who made them
 * @apiSuccess {String} domain Mongo DB pointer to the domain that it is attributed to
 * @apiSuccess {Array} author Authors that have been attributed to the article
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 201 CREATED
 *  {
 *    "articles": [
 *      {
 *        "url": "money.cnn.com",
 *        "id": "59e211106617b361f022b1b6",
 *        "domains": [
 *          "59e2123b3514724de446d050",
 *          "59e212cb84782e31a0208af5"
 *        ],
 *        "articles": [
 *          "59e2123b3514724de446d050",
 *          "59e212cb84782e31a0208af5"
 *        ],
 *        "tags": [
 *          {
 *            "name": "goodSources",
 *            "count": 50,
 *            "snr": 1.4
 *          }
 *        ]
 *      }
 *  }
 *  
 * @apiError MissingInformationError The information required to login was not present
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 400 BAD REQUEST
 *  {
 *    "errors": [
 *      {
 *        "message": "Missing required values",
 *      }
 *    ]
 *  }
 * 
 * @apiError ValidationError The information submitted did not pass validation or was not found in the db
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 401 UNAUTHORIZED
 *  {
 *    "errors": [
 *      {
 *        "message": "unauthorized",
 *      }
 *    ]
 *  }
 * 
 * @apiError InternalServerError The server encountered an error while processing the request
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 500 INTERNAL SERVER ERROR
 *  {
 *    "errors": [
 *      {
 *        "parameter": " mu-hackathon-server.users.$username_1 dup key",
 *        "message": "E11000 duplicate key error index",
 *        "value": " \"DeathwingX\" }"
 *      }
 *    ]
 *  }
 * 
 * @apiExample Example usage:
 *  {
 *    "url": "http://www.foxnews.com/politics/2017/10/13/hillary-clinton-calls-trump-sexual-assaulter-in-bbc-interview-but-says-bills-behavior-in-past.html",
 *    "author": "Matt Bernardini",
 *    "id": "59e211106617b361f022b1b6",
 *    "tags": ["goodSources", "prettyPicture", "highQuality"]
 *   }
 */
router.post('/', (req, res) => {
  let erArray = {}
  if (!req.body.url && !req.body.author && !req.body.id) {
    return res.status(400).json({errors: [{message: 'missing required values'}]})
  }
  curl.get(req.body.url, (error, body) => {
    if (!_.isEmpty(error)) {
      console.log(error)
      erArray.errors.push(new errors.ErrorMessage(error.errmsg.split(':')[0],
        error.errmsg.split(':')[1], error.errmsg.split(':')[3]))
      return res.status(500).json({errors: [erArray.errors]})
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
    article.title = dom.querySelector('h1').childNodes[0].rawText
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
          domain.authors.push(author._id)
          domain.articles.push(article._id)
          user.articles.push(article._id)
          user.save()
          article.save()
          author.save()
          domain.save()
          console.log(user)
          console.log(article)
          console.log(domain)
          console.log(author)
          res.sendStatus(201).json({articles: [article]})
        })
      })
    })
  })
})
/**
 * @api {post} /articles Requests for accessing articles data
 * @apiSampleRequest https://mu-hackathon.herokuapp.com/articles
 * @apiName PostArticles
 * @apiGroup Article
 * 
 * @apiParam {String} url URL of the article to add
 * @apiParam {String} author Name of the author to attribute the article
 * @apiParam {String} id Id of the user that is adding the article
 * @apiParam {Array} tags An array of strings consisting of the tags the user wants to add to the article
 * 
 * @apiSuccess {String} url Url of the article
 * @apiSuccess {String} id Mongo ID of the object
 * @apiSuccess {String} title Title of the article
 * @apiSuccess {Array} tags An array of tags, associated with the user who made them
 * @apiSuccess {String} domain Mongo DB pointer to the domain that it is attributed to
 * @apiSuccess {Array} author Authors that have been attributed to the article
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 SUCCESS
 *  
 * @apiError MissingInformationError The information required to login was not present
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 400 BAD REQUEST
 *  {
 *    "errors": [
 *      {
 *        "message": "Missing required values",
 *      }
 *    ]
 *  }
 * 
 * @apiError ValidationError The information submitted did not pass validation or was not found in the db
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 401 UNAUTHORIZED
 *  {
 *    "errors": [
 *      {
 *        "message": "unauthorized",
 *      }
 *    ]
 *  }
 * 
 * @apiError InternalServerError The server encountered an error while processing the request
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 500 INTERNAL SERVER ERROR
 *  {
 *    "errors": [
 *      {
 *        "parameter": " mu-hackathon-server.users.$username_1 dup key",
 *        "message": "E11000 duplicate key error index",
 *        "value": " \"DeathwingX\" }"
 *      }
 *    ]
 *  }
 * 
 * @apiExample Example usage:
 *  {
 *    "url": "http://www.foxnews.com/politics/2017/10/13/hillary-clinton-calls-trump-sexual-assaulter-in-bbc-interview-but-says-bills-behavior-in-past.html",
 *    "id": "59e211106617b361f022b1b6",
 *    "tags": ["goodSources", "prettyPicture", "highQuality"]
 *   }
 */
router.patch('/', (req, res) => {
  console.log('PATCH /articles/')
  console.log(req.body)
  var user
  var author
  var article
  User.findOne({_id: req.body.id}, (err, foundUser) => {
    if (!_.isEmpty(err)) {
      console.log(err)
      return res.status(500).json({errors: {message: 'Error occured'}})
    }
    user = foundUser
    Article.findOne({url: req.body.url}, (err, fArticle) => {
      if (!_.isEmpty(err)) {
        console.log(err)
        return res.status(500).json({errors: {message: 'Error occured'}})
      }
      article = fArticle
      Author.findOne({_id: article.author[0]}, (err, foundAuthor) => {
        if (!_.isEmpty(err)) {
          console.log(err)
          return res.status(500).json({errors: {message: 'Error occured'}})
        }
        author = foundAuthor
        _.forEach(req.body.tags, (tag) => {
          let tagCheck = false
          _.forEach(author.tags, (iTag) => {
            if (tag === iTag.name) {
              iTag.count = iTag.count + 1
              iTag.save()
              tagCheck = true
            }
          })
          if (!tagCheck) {
            // If we didnt find the tag
            author.tags.push({name: tag, count: 1, snr: 0})
          }
        })
        user.articles.push(article._id)
        user.save()
        article.save()
        author.save()
        console.log(user)
        console.log(article)
        console.log(author)
        res.sendStatus(200)
      })
    })
  })
})
/**
 * @api {get} /articles Requests for accessing articles data
 * @apiSampleRequest https://mu-hackathon.herokuapp.com/articles/:query
 * @apiName GetArticles
 * @apiGroup Article
 * 
 * @apiParam {String} query Mongo Query String of the information requested
 * 
 * @apiSuccess {String} url Url of the article
 * @apiSuccess {String} id Mongo ID of the object
 * @apiSuccess {String} title Title of the article
 * @apiSuccess {Array} tags An array of tags, associated with the user who made them
 * @apiSuccess {String} domain Mongo DB pointer to the domain that it is attributed to
 * @apiSuccess {Array} author Authors that have been attributed to the article
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 SUCCESS
 *  {
 *    "articles": [
 *      {
 *        "url": "money.cnn.com",
 *        "id": "59e211106617b361f022b1b6",
 *        "domains": [
 *          "59e2123b3514724de446d050",
 *          "59e212cb84782e31a0208af5"
 *        ],
 *        "articles": [
 *          "59e2123b3514724de446d050",
 *          "59e212cb84782e31a0208af5"
 *        ],
 *        "tags": [
 *          {
 *            "name": "goodSources",
 *            "count": 50,
 *            "snr": 1.4
 *          }
 *        ]
 *      }
 *  }
 *  
 * @apiError MissingInformationError The information required to login was not present
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 400 BAD REQUEST
 *  {
 *    "errors": [
 *      {
 *        "message": "Missing required values",
 *      }
 *    ]
 *  }
 * 
 * @apiError ValidationError The information submitted did not pass validation or was not found in the db
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 401 UNAUTHORIZED
 *  {
 *    "errors": [
 *      {
 *        "message": "unauthorized",
 *      }
 *    ]
 *  }
 * 
 * @apiError InternalServerError The server encountered an error while processing the request
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 500 INTERNAL SERVER ERROR
 *  {
 *    "errors": [
 *      {
 *        "parameter": " mu-hackathon-server.users.$username_1 dup key",
 *        "message": "E11000 duplicate key error index",
 *        "value": " \"DeathwingX\" }"
 *      }
 *    ]
 *  }
 * 
 * @apiExample Example usage:
 * curl -i https://mu-hackathon.herokuapp.com/authors?author=59e2123b3514724de446d050
 */
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
