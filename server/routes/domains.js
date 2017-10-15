const express = require('express')
const MongoQS = require('mongo-querystring')
const router = new express.Router()
const Domain = require('../models/domain')
const prep = require('../help/prepForSend')
const errors = require('../help/errors')
const _ = require('lodash')

/**
 * @api {get} /domains Requests for accessing domain data
 * @apiSampleRequest https://mu-hackathon.herokuapp.com/domains/:query
 * @apiName GetDomain
 * @apiGroup Domain
 * 
 * @apiParam {String} query Mongo Query String of the information requested
 * 
 * @apiSuccess {String} name FQDN of the domain
 * @apiSuccess {String} id Mongo ID of the object
 * @apiSuccess {Array} articles Array of articles that the domain has attributed to them
 * @apiSuccess {Array} authors Articles the user has submitted tags for
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 SUCCESS
 *  {
 *    "domains": [
 *      {
 *        "name": "www.foxnews.com",
 *        "id": "59e211106617b361f022b1b6",
 *        "articles": [
 *          "59e2123b3514724de446d050",
 *          "59e212cb84782e31a0208af5"
 *        ],
 *        "authors": [
 *          "59e2123b3514724de446d050",
 *          "59e212cb84782e31a0208af5"
 *        ]
 *      },
 *      {
 *        "name": "money.cnn.com",
 *        "id": "59e211106617b361f022b1b6",
 *        "articles": [
 *          "59e2123b3514724de446d050",
 *          "59e212cb84782e31a0208af5"
 *        ],
 *        "authors": [
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
 * curl -i https://mu-hackathon.herokuapp.com/domains?author=59e2123b3514724de446d050
 */
router.get('/', (req, res) => {
  let erArray = {}
  console.log('GET /domains')
  console.log(req.query)
  const qs = new MongoQS({
    custom: {
      urlQueryParamName: function (query, input) {
        query['_id'] = input.id
        query['name'] = input.name
        query['articles'] = input.articles
        query['authors'] = input.authors
      }
    }
  })
  const query = qs.parse(req.query)
  if (_.isEmpty(query)) {
    return res.status(400).json({errors: [{message: 'missing required values'}]})
  }
  Domain.find(query, (error, domain2) => {
    if (!_.isEmpty(error)) {
      console.log(error)
      erArray.errors.push(new errors.ErrorMessage(error.errmsg.split(':')[0],
        error.errmsg.split(':')[1], error.errmsg.split(':')[3]))
      return res.status(500).json({errors: [erArray.errors]})
    }
    let domains = []
    _.forEach(domain2, function (u) {
      domains.push(prep.prepForSend(u))
    })
    return res.status(200).json({domains})
  })
})
module.exports = router
