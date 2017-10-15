const express = require('express')
const router = new express.Router()
const Author = require('../models/author')
const prep = require('../help/prepForSend')
const errors = require('../help/errors')
const _ = require('lodash')
const MongoQS = require('mongo-querystring')

/**
 * @api {get} /authors Requests for accessing authors data
 * @apiSampleRequest https://mu-hackathon.herokuapp.com/authors/:query
 * @apiName GetAuthors
 * @apiGroup Author
 * 
 * @apiParam {String} query Mongo Query String of the information requested
 * 
 * @apiSuccess {String} name Name of the author
 * @apiSuccess {String} id Mongo ID of the object
 * @apiSuccess {Array} tags An array of tags, the number of times seen, and how accurate they are
 * @apiSuccess {Array} articles Array of articles that the author has attributed to them
 * @apiSuccess {Array} domains Domains the author has submitted articles for
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 SUCCESS
 *  {
 *    "authors": [
 *      {
 *        "name": "money.cnn.com",
 *        "id": "59e211106617b361f022b1b6",
 *        "domains": [
 *          "59e2123b3514724de446d050",
 *          "59e212cb84782e31a0208af5"
 *        ],
 *        "articles": [
 *          "59e2123b3514724de446d050",
 *          "59e212cb84782e31a0208af5"
 *        ],
 *        "tags": [
 *          {
 *            "name": "goodSources",
 *            "count": 50,
 *            "snr": 1.4
 *          }
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
 * curl -i https://mu-hackathon.herokuapp.com/authors?author=59e2123b3514724de446d050
 */

router.get('/', (req, res) => {
  let erArray = {}
  console.log('GET /authors')
  console.log(req.query)
  const qs = new MongoQS({
    custom: {
      urlQueryParamName: function (query, input) {
        query['_id'] = input.id
        query['name'] = input.name
        query['domains'] = input.domains
        query['tags'] = input.tags
      }
    }
  })
  const query = qs.parse(req.query)
  if (_.isEmpty(query)) {
    return res.status(400).json({errors: [{message: 'missing required values'}]})
  }
  Author.find(query, (error, author2) => {
    if (!_.isEmpty(error)) {
      console.log(error)
      erArray.errors.push(new errors.ErrorMessage(error.errmsg.split(':')[0],
        error.errmsg.split(':')[1], error.errmsg.split(':')[3]))
      return res.status(500).json({errors: [erArray.errors]})
    }
    let authors = []
    _.forEach(author2, function (u) {
      authors.push(prep.prepForSend(u))
    })
    return res.status(200).json({authors})
  })
})
module.exports = router
