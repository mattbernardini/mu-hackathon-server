const express = require('express')
const router = new express.Router()
const Author = require('../models/author')

router.patch('/', (req, res) => {
  console.log('PATCH /users/')
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

module.exports = router
