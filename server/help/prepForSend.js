const _ = require('lodash')
module.exports = {
  prepForSend (obj) {
    if (!_.isEmpty(obj.password)) {
      delete obj.password
      obj.password = undefined
    }
    if (obj.ip) {
      delete obj.inspect
      obj.ip = undefined
    }
    if (obj._doc.passwordResetExpires) {
      delete obj.passwordResetExpires
    }
    if (obj._doc.passwordResetToken) {
      delete obj.passwordResetToken
    }
    const newObj = Object.assign({ id: obj._id }, obj._doc)
    delete newObj._id
    return newObj
  }
}
