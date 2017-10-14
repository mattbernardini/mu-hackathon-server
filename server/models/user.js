const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// User Schema
const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  lastLogin: {
    type: Date
  },
  ip: [{
    value: String,
    dateUsed: Date
  }],
  articles: [{
    type: String
  }]

})

const User = module.exports = mongoose.model('User', UserSchema)

// returns user information by userID
module.exports.getUserById = function (id, callback) {
  User.findById(id, callback)
}

// returns information for a specific user
module.exports.getUserByUsername = function (username, callback) {
  User.findOne({username}, callback)
}

// returns information for a specific user based on email
module.exports.getUserByEmail = function (email, callback) {
  console.log('here22')
  User.findOne({email}, callback)
}

// Adds user to the mongoDb
module.exports.addUser = function (newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.log('error', err)
    } else {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) { console.log('error', err) }
        newUser.password = hash
        newUser.save(callback)
      })
    }
  })
}

// checks if user's password is correct or not
module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err
    callback(null, isMatch)
  })
}

// Updates user info
module.exports.updateUser = function (id, updatedUser, callback) {
  console.log(updatedUser)
  User.findByIdAndUpdate({_id: id}, updatedUser, callback)
}

// Checks to see if a username is already being used
module.exports.doesUserNameExist = function (user, callback) {
  console.log(user)
  User.find({username: user.username}, callback)
}
