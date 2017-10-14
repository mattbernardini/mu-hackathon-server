const validator = require('validator')
const _ = require('lodash')
const typeCheck = require('type-check').typeCheck
const errors = require('./errors')
const User = require('../models/user')

/**
 * Functions return undefined due to TypeScript not allowing null or false.
 *
 * Functions are negated in order to avoid having empty success.
 */
function validateAlphaString (propertyValue, propertyName = '', failureMessage = '') {
  if (!typeCheck('String', propertyValue) && !validator.isAlpha(propertyValue)) {
    const errorMessage = new errors.ErrorMessage(failureMessage, propertyName, propertyValue)
    return errorMessage
  }
  return undefined
}
function validateEmail (email) {
  if (!validator.isEmail(email)) {
    console.log('email error')
    const errorMessage = new errors.ErrorMessage('Please use a valid email address', 'email', email)
    return errorMessage
  }
  return undefined
}
function validateWordWithSpacePattern (propertyValue, propertyName = '', failureMessage = '') {
  // This regex allows a word followed by an optional space.  This pattern must occur at least once
  if (!/((\w+)[ -]?){1,}/.test(propertyValue)) {
    const errorMessage = new errors.ErrorMessage(failureMessage, propertyName, propertyValue)
    return errorMessage
  }
  return undefined
}
function validateNumberString (propertyValue, propertyName = '', failureMessage = '') {
  const regex = /\d+/
  if (!regex.test(propertyValue)) {
    const errorMessage = new errors.ErrorMessage(failureMessage, propertyName, propertyValue)
    return errorMessage
  }
  return undefined
}
function validateUsername (username) {
  if (!validator.isAlphanumeric(username)) {
    const errorMessage = new errors.ErrorMessage('Please enter a valid username', 'username', username)
    return errorMessage
  }
  return undefined
}
function validateMongoIdArray (propertyValue, propertyName = '', failureMessage = '') {
  let x = 0
  const errorArray = new errors.ErrorArray()
  _.forEach(propertyValue, function (MongoId) {
    if (!validator.isMongoId(MongoId)) {
      const errorMessage = new errors.ErrorMessage('Please enter valid mongoid', propertyName +
        '[' + x + ']', MongoId)
      errorArray.errors.push(errorMessage)
    }
    x++
  })
  if (!_.isEmpty(errorArray)) {
    return errorArray
  }
  return undefined
}
function validateMongoId (propertyValue, propertyName = '', failureMessage = '') {
  if (!validator.isMongoId(propertyValue)) {
    const errorMessage = new errors.ErrorMessage('Please enter valid mongoid', propertyName, propertyValue)
    return errorMessage
  }
}
module.exports = {
  validationWrapper (obj, callback) {
    const errorArray = new errors.ErrorArray()
    if (obj.id && validateMongoId(obj.id)) {
      errorArray.errors.push(validateMongoId(obj.id, 'id', 'Please enter valid MongoId'))
    }
    if (obj.email && validateEmail(obj.email)) {
      console.log('here')
      errorArray.errors.push(validateEmail(obj.email))
    }
    if (obj.username && validateUsername(obj.username)) {
      errorArray.errors.push(validateUsername(obj.username))
    }
    if (!_.isEmpty(obj.articles) && validateMongoIdArray(obj.articles)) {
      _.forEach(validateMongoIdArray(obj.articles), function (err) {
        errorArray.errors.push(err)
      })
    }
    callback(errorArray)
  }
}
