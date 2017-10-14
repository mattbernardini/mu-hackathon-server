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

module.exports = router
