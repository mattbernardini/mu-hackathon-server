const express = require('express')
const User = require('../models/user')
const MongoQS = require('mongo-querystring')
const prep = require('../help/prepForSend')
const _ = require('lodash')
const val = require('../help/validation')
const router = new express.Router()

/*
  This file contains api calls for user profile, updateUser, getAllUsers, classes
    /user/profile | GET | Retrives user Information
      Authrization
      Information Expected :
        JWT token
      Returns:
        Fail:
          General err ->
            Boolean | Success | false
            String | err | err message
          authentication failure ->
            Boolean | Success | false
            String | msg | err message
        Success:
          JSON object named user
          user{
            fName,
            lName,
            userName,
            email
          }
     ----------------------------------------------------
     /user/updateUser | POST | Allows client to update user
        Content-Type : application/json
        Infomation Expected:
          id, content to be updated
        Returns:
          Fail:
            General err ->
              Boolean | Success | false
              String | err | err message
          Success:
            Boolean | Success | true
            String | msg | User readable message

*/

router.patch('/', (req, res) => {
  console.log('PATCH /users/')
  console.log(req.body)
  let erArray = {}
  var updatedUser = {...req.body}
  val.validationWrapper(updatedUser, (errorArray) => {
    erArray = errorArray
    console.log(erArray.errors)
    if (!_.isEmpty(erArray.errors)) {
      console.log(erArray.errors)
      return res.status(400).json({errors: erArray.errors})
    }
    User.updateUser(req.body.id, updatedUser, (err) => {
      if (err) {
        console.log(err)
        return res.status(500).json({errors: {message: 'Error occured, fialed to update '}})
      } else {
        return res.status(200)
      }
    })
  })
})

router.get('/', (req, res) => {
  console.log('GET /users')
  console.log(req.query)
  const qs = new MongoQS({
    custom: {
      urlQueryParamName: function (query, input) {
        query['username'] = input.username
        query['email'] = input.email
        query['articles'] = input.articles
      }
    }
  })
  const query = qs.parse(req.query)
  User.find(query, (err, user2) => {
    if (err) {
      console.log(err)
      return res.status(500).json({errors: {message: 'Error occured'}})
    }
    let users = []
    _.forEach(user2, function (u) {
      users.push(prep.prepForSend(u))
    })
    res.json({users})
  })
})
module.exports = router
