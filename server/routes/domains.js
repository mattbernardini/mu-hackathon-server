const express = require('express')
const router = new express.Router()
const Domain = require('../models/domain')

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

module.exports = router
