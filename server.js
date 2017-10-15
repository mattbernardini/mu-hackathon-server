const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const mongoose = require('mongoose')
const config = require('./config/database')
const path = require('path')
// const PDFParser = require('pdf2json')
// const fs = require('fs')
// let pdfParser = new PDFParser()

mongoose.Promise = global.Promise
// Connect To Database
// ued useMOngoClient | keep Alive | reconnectTries to solve depracation warning and open Uri warning
mongoose.connect(config.database, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
})

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to Mongo Database: ' + config.database)
})

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: ' + err)
})
const app = express()

// Allow CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

const port = process.env.PORT || 3000

// tellint the app to look for static files in these directories
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()) // <--- Here

require('./config/passport')(passport)

// routes
const authRoutes = require('./server/routes/auth') // /login /signup /profile
const userRoute = require('./server/routes/users')
const articleRoute = require('./server/routes/articles')
const authorRoute = require('./server/routes/authors')
const domainRoute = require('./server/routes/domains')

// to push
// list of backend routes in our app
app.use('/auth', authRoutes)
app.use('/users', userRoute)
app.use('/articles', articleRoute)
app.use('/authors', authorRoute)
app.use('/domains', domainRoute)

app.listen(port, () => {
  console.log('Server started on port ' + port)
})
