const express = require('express')
const User = require('../models/user')
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

  var updatedUser = {...req.body}

  User.updateUser(req.body.id, updatedUser, (err) => {
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
