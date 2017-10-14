const validator = require('validator')
const _ = require('lodash')
const typeCheck = require('type-check').typeCheck
const errors = require('./errors')
const users = require('../models/user')
class FcValidation {
  /**
   * Functions return undefined due to TypeScript not allowing null or false.
   *
   * Functions are negated in order to avoid having empty success.
   */
  static validateAlphaString (propertyValue, propertyName = '', failureMessage = '') {
    if (!typeCheck('String', propertyValue) && !validator.isAlpha(propertyValue)) {
      const errorMessage = new errors.ErrorMessage(failureMessage, propertyName, propertyValue)
      return errorMessage
    }
    return undefined
  }
  static validateEmail (email) {
    if (!typeCheck('String', email) && !validator.isEmail(email)) {
      const errorMessage = new errors.ErrorMessage('Please use a valid email address', 'email', email)
      return errorMessage
    }
    return undefined
  }
  static validateWordWithSpacePattern (propertyValue, propertyName = '', failureMessage = '') {
    // This regex allows a word followed by an optional space.  This pattern must occur at least once
    const regex = /((\w+)[ -]?){1,}/
    if (!typeCheck('String', propertyValue) && !regex.test(propertyValue)) {
      const errorMessage = new errors.ErrorMessage(failureMessage, propertyName, propertyValue)
      return errorMessage
    }
    return undefined
  }
  static validateNumberString (propertyValue, propertyName = '', failureMessage = '') {
    const regex = /\d+/
    if (!typeCheck('String', propertyValue) && !regex.test(propertyValue)) {
      const errorMessage = new errors.ErrorMessage(failureMessage, propertyName, propertyValue)
      return errorMessage
    }
    return undefined
  }
  static validateUsername (username) {
    if (!typeCheck('String', username) && !validator.isAlphanumeric(username)) {
      const errorMessage = new errors.ErrorMessage('Please enter a valid username', 'username', username)
      return errorMessage
    }
    return undefined
  }
  static validateMongoIdArray (propertyValue, propertyName = '', failureMessage = '') {
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
    return undefined
  }
  static validationWrapper (obj) {
    const errorArray = new errors.ErrorArray()
    if (obj.email && FcValidation.validateEmail(obj.email)) {
      errorArray.errors.push(FcValidation.validateEmail(obj.email))
    }
    if (obj.username && FcValidation.validateUsername(obj.username)) {
      errorArray.errors.push(FcValidation.validateUsername(obj.username))
    }
    return errorArray
  }
}
exports.FcValidation = FcValidation
