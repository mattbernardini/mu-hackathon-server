const val = require('../help/validation')
const prep = require('../help/prepForSend')
const express = require('express')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../../config/database')
const router = new express.Router()

/*
  This file contains api calls for user signup, login and profile information.
  api calls
      /auth/signup | POST | Allows user to Sign up
        Content-Type : application/json
        Information Expected
          fName, lName, email, username, password, shcool, password, degree, year
        Returns:
          Fail:
            General err ->
              Boolean | Success | false
              String | err | err message
            Query to find username returned name ->
              Boolean | Success | Fail
              String | msg | Username already taken
          Success:
            Boolean | Success | Ture
            String | token | JWT token
            String | msg | User Registered
     ----------------------------------------------------
     /auth/login | POST | Allows user to Login
      Content-Type : application/json
      Information Expected during login :
        userName
        password
      Returns:
        Fail:

          User not found.
          Wrong password.
        Sucess:
          returns token
    ----------------------------------------------------
    /auth/logout | POST | Allows user to logout
     Content-Type : application/json
     Information Expected during logout :
       user id
     Returns:
       Fail:
         Error Message
         String | msg | user friendly message
         String | err | err message
         Boolean | Success | False
       Sucess:
         Boolean | Success | True
         String | msg | user friendly message

*/

// /signup api call
router.post('/signup', (req, res) => {
  // Log to find where we are
  console.log('POST /auth/signup')
  console.log(req.body)

  // Create new user to pass to function
  const newUser = new User(req.body)
  console.log(newUser)
  let erArray = {}
  val.validationWrapper(newUser, (errorArray) => {
    erArray = errorArray
    console.log(erArray.errors)
    if (!_.isEmpty(erArray.errors)) {
      console.log(erArray.errors)
      return res.status(400).json({errors: erArray.errors})
    }
    // Username is not taken so add new user
    // Have not touched this since before 9/9/17
    User.addUser(newUser, (err, user2) => {
      // Handle error
      if (err) {
        console.log(err)
        res.json({err})
      } else {
        // Add user and set token
        const user = prep.prepForSend(user2)
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        })

        return res.status(201).json({token, user})
      }
    })
  })
})

// /login Api call taken in a json and if user exists it returns a token
router.post('/login', (req, res) => {
  console.log(req.body)
  // Log username and password in the console
  const username = req.body.username
  const password = req.body.password
  // console.log('username: ', username, 'password: ', password)

  // Check to see if the username exists
  User.getUserByUsername(username, (err, user2) => {
    // Log where we are in the api
    console.log('/auth/login API call called')
    // Handle err
    if (err) throw err
    // If the user doesnt exist
    if (!user2) {
      // Log info
      console.log('No User Found')
      // Set RFC 7235 401 header info
      return res.status(401).setHeader('WWW-Authenticate', 'Basic realm="CrowdCheck"')
        .json({errors: {message: 'bad username'}})
    }
    // If the user does exist check the password
    User.comparePassword(password, user2.password, (err, isMatch) => {
      // Lod where we are
      console.log('compare pass')
      // Handle error
      if (err) throw err
      // If it is a match
      if (isMatch) {
        // Create jwt token
        const user = prep.prepForSend(user2)
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        })

        return res.status(201).json({token, user})
      } else {
        // Set RFC 7235 401 header info
        return res.status(401).setHeader('WWW-Authenticate', 'Basic realm="FASTCampus"')
          .json({errors: {message: 'Bad password'}})
      }
    })
  })
})

module.exports = router
