const express = require('express')
const User = require('../models/user')
const MongoQS = require('mongo-querystring')
const prep = require('../help/prepForSend')
const _ = require('lodash')
const errors = require('../help/errors')
const router = new express.Router()

/**
 * @api {get} /users Requests for accessing user data
 * @apiSampleRequest https://mu-hackathon.herokuapp.com/users/:query
 * @apiName GetUser
 * @apiGroup User
 * 
 * @apiParam {String} query Mongo Query String of the information requested
 * 
 * @apiSuccess {String} username Username of the user
 * @apiSuccess {String} email Email of the user
 * @apiSuccess {String} id Mongo ID of the user
 * @apiSuccess {Array} articles Articles the user has submitted tags for
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 SUCCESS
 *  {
 *    "users": [
 *      {
 *        "username": "JohnDoe",
 *        "email": "valid@email.com",
 *        "id": "59e211106617b361f022b1b6",
 *        "articles": [
 *          "59e2123b3514724de446d050",
 *          "59e212cb84782e31a0208af5"
 *        ]
 *      },
 *      {
 *        "username": "JaneDoe",
 *        "email": "valid2@email.com",
 *        "id": "59e211106617b361f022b1b6",
 *        "articles": [
 *          "59e2123b3514724de446d050",
 *          "59e212cb84782e31a0208af5"
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
 * curl -i https://mu-hackathon.herokuapp.com/users?email~=valid
 */
router.get('/', (req, res) => {
  let erArray = {}
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
  if (_.isEmpty(query)) {
    return res.status(400).json({errors: [{message: 'missing required values'}]})
  }
  User.find(query, (error, user2) => {
    if (!_.isEmpty(error)) {
      console.log(error)
      erArray.errors.push(new errors.ErrorMessage(error.errmsg.split(':')[0],
        error.errmsg.split(':')[1], error.errmsg.split(':')[3]))
      return res.status(500).json({errors: [erArray.errors]})
    }
    let users = []
    _.forEach(user2, function (u) {
      users.push(prep.prepForSend(u))
    })
    return res.status(200).json({users})
  })
})
module.exports = router
