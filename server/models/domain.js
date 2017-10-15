const mongoose = require('mongoose')
const whois = require('whois')
const _ = require('lodash')

const domainSchema = mongoose.Schema({
  name: {
    type: String
  },
  whois: {
    type: Object
  },
  articles: [{
    type: String
  }],
  authors: [{
    type: String
  }]
})

const Domain = module.exports = mongoose.model('Domain', domainSchema)

module.exports.addDomain = function (newDomain, callback) {
  console.log('inside add domain')
  console.log(newDomain)
  whois.lookup('cnn.com', {server: 'az whois.ripe.net'}, (err, data) => {
    console.log(JSON.stringify(data, null, 2))
    console.log('inside whois')
    if (!_.isEmpty(err)) {
      console.log('here')
    }
    const newD2 = new Domain({
      name: newDomain,
      whois: data
    })
    newD2.save()
  })
}

module.exports.updateDomain = function (_id, updatedDomain, callback) {
  console.log(updatedDomain)
  Domain.findByIdAndUpdate({_id}, updatedDomain, callback)
}

module.exports.deleteDomain = function (_id, callback) {
  Domain.findByIdAndRemove({_id}, callback)
}
