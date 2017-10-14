const express = require('express')
const router = new express.Router()
const Author = require('../models/author')
const prep = require('../help/prepForSend')
const _ = require('lodash')

router.patch('/', (req, res) => {
  console.log('PATCH /authors/')
  console.log(req.body)

  var updatedAuthor = {...req.body}

  Author.updateAuthor(req.body._id, updatedAuthor, (err) => {
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
  console.log('GET /authors')
  console.log(req.query)
  const qs = new MongoQS({
    custom: {
      urlQueryParamName: function (query, input) {
        query['name'] = input.name
        query['domains'] = input.domains
        query['tags'] = input.tags
      }
    }
  })
  const query = qs.parse(req.query)
  Author.find(query, (err, author2) => {
    if (err) {
      console.log(err)
      return res.status(500).json({errors: {message: 'Error occured'}})
    }
    let authors = []
    _.forEach(author2, function (u) {
      authors.push(prep.prepForSend(u))
    })
    res.json({authors})
  })
})
const MongoQS = require('mongo-querystring')

module.exports = router
