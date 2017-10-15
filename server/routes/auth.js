const val = require('../help/validation')
const prep = require('../help/prepForSend')
const errors = require('../help/errors')
const express = require('express')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../../config/database')
const router = new express.Router()

/**
 * @api {post} /auth/signup Request for signup
 * @apiSampleRequest https://mu-hackathon.herokuapp.com/auth/signup
 * @apiName Signup
 * @apiGroup Auth
 * 
 * @apiParam {String} username Username of user being added
 * @apiParam {String} email Email of the user being added
 * @apiParam {String} password Password of the user being added
 * 
 * @apiSuccess {String} username Username of the user
 * @apiSuccess {String} email Email of the user
 * @apiSuccess {String} id Mongo ID of the user
 * @apiSuccess {Array} articles Articles the user has submitted tags for
 * @apiSuccess {Token} jwt JWT token used in the controlling access
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 201 CREATED
 *  {
 *    "user": {
 *      "username": "JohnDoe",
 *      "email": "valid@email.com",
 *      "id": "59e211106617b361f022b1b6",
 *      "articles": [
 *        "59e2123b3514724de446d050",
 *        "59e212cb84782e31a0208af5"
 *      ]
 *    },
 *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ZTM0NGRmZjExOWJkMWNjYzUwZjU1MiIsImFydGljbGVzIjpbX
 *   SwidXNlcm5hbWUiOiJEZWF0aHdpbmdYIiwiZW1haWwiOiJtYXR0LmJlcm5hcmRpbmlAZ21haWwuY29tIiwiX192IjowLCJpYXQiOjE1MDgwNjY1Mjcs
 *   ImV4cCI6MTUwODY3MTMyN30.fyTG6imgxHq7YlBOekzvPwi_kpT6AZ-XO7l0tT15RiU"
 *  }
 *  
 * @apiError ValidationError The information submitted did not pass validation
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 400 BAD REQUEST
 *  {
 *    "errors": [
 *      {
 *        "parameter": "username",
 *        "message": "Please use only alphanumeric characters for username",
 *        "value": "Ih@t3val1d@t1on"
 *      },
 *      {
 *        "parameter": "email",
 *        "message": "Please enter a valid email",
 *        "value": "ihatevalidemails"
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
 * @apiExample [{application/json}] Signup
 *  {
 *    "username": "JohnDoe",
 *    "email": "valid@email.com",
 *    "password": "password"
 *  }
 */
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
    User.addUser(newUser, (error, user2) => {
      // Handle error
      if (!_.isEmpty(error)) {
        console.log(error)
        erArray.errors.push(new errors.ErrorMessage(error.errmsg.split(':')[0],
          error.errmsg.split(':')[1], error.errmsg.split(':')[3]))
        return res.status(500).json({errors: [erArray.errors]})
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

/**
 * @api {post} /auth/login Request for login
 * @apiSampleRequest https://mu-hackathon.herokuapp.com/auth/login
 * @apiName Login
 * @apiGroup Auth
 * 
 * @apiParam {String} username Username of user logging in
 * @apiParam {String} password Password of the user logging in
 * 
 * @apiSuccess {String} username Username of the user
 * @apiSuccess {String} email Email of the user
 * @apiSuccess {String} id Mongo ID of the user
 * @apiSuccess {Array} articles Articles the user has submitted tags for
 * @apiSuccess {Token} jwt JWT token used in the controlling access
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 SUCCESS
 *  {
 *    "user": {
 *      "username": "JohnDoe",
 *      "email": "valid@email.com",
 *      "id": "59e211106617b361f022b1b6",
 *      "articles": [
 *        "59e2123b3514724de446d050",
 *        "59e212cb84782e31a0208af5"
 *      ]
 *    },
 *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ZTM0NGRmZjExOWJkMWNjYzUwZjU1MiIsImFydGljbGVzIjpbX
 *   SwidXNlcm5hbWUiOiJEZWF0aHdpbmdYIiwiZW1haWwiOiJtYXR0LmJlcm5hcmRpbmlAZ21haWwuY29tIiwiX192IjowLCJpYXQiOjE1MDgwNjY1Mjcs
 *   ImV4cCI6MTUwODY3MTMyN30.fyTG6imgxHq7YlBOekzvPwi_kpT6AZ-XO7l0tT15RiU"
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
 * @apiExample [{application/json}] Signup
 *  {
 *    "username": "JohnDoe",
 *    "password": "password"
 *  }
 */
router.post('/login', (req, res) => {
  console.log(req.body)
  let erArray = {}
  // Log username and password in the console
  if (_.isEmpty(req.body.username) || _.isEmpty(req.body.password)) {
    return res.status(400).json({errors: [{message: 'Missing required values'}]})
  }
  const username = req.body.username
  const password = req.body.password

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
        .json({errors: {message: 'unauthorized'}})
    }
    // If the user does exist check the password
    User.comparePassword(password, user2.password, (error, isMatch) => {
      // Lod where we are
      console.log('compare pass')
      // Handle error
      if (!_.isEmpty(error)) {
        console.log(error)
        erArray.errors.push(new errors.ErrorMessage(error.errmsg.split(':')[0],
          error.errmsg.split(':')[1], error.errmsg.split(':')[3]))
        return res.status(500).json({errors: [erArray.errors]})
      }
      // If it is a match
      if (isMatch) {
        // Create jwt token
        const user = prep.prepForSend(user2)
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        })

        return res.status(200).json({token, user})
      } else {
        // Set RFC 7235 401 header info
        return res.status(401).setHeader('WWW-Authenticate', 'Basic realm="CrowdCheck"')
          .json({errors: {message: 'unauthorized'}})
      }
    })
  })
})

module.exports = router
