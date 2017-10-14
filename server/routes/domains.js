const express = require('express')
const router = new express.Router()
const Domain = require('../models/domain')
const prep = require('../help/prepForSend')
const _ = require('lodash')

router.patch('/', (req, res) => {
  console.log('PATCH /domains/')
  console.log(req.body)

  var updatedDomain = {...req.body}

  Domain.updateAuthor(req.body._id, updatedDomain, (err) => {
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
  console.log('GET /domains')
  console.log(req.query)
  const qs = new MongoQS({
    custom: {
      urlQueryParamName: function (query, input) {
        query['name'] = input.name
        query['date'] = input.date
      }
    }
  })
  const query = qs.parse(req.query)
  Domain.find(query, (err, domain2) => {
    if (err) {
      console.log(err)
      return res.status(500).json({errors: {message: 'Error occured'}})
    }
    let domains = []
    _.forEach(domain2, function (u) {
      domains.push(prep.prepForSend(u))
    })
    res.json({domains})
  })
})
const MongoQS = require('mongo-querystring')

module.exports = router
