const mongoose = require('mongoose')

const domainSchema = mongoose.Schema({
  name: {
    type: String
  },
  whois: {
    type: Object
  }
})

const Domain = module.exports = mongoose.model('Domain', domainSchema)

module.exports.addDomain = function (newDomain, callback) {
  newDomain.save(callback)
}

module.exports.updateDomain = function (_id, updatedDomain, callback) {
  console.log(updatedDomain)
  Domain.findByIdAndUpdate({_id}, updatedDomain, callback)
}

module.exports.deleteDomain = function (_id, callback) {
  Domain.findByIdAndRemove({_id}, callback)
}
