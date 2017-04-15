var express = require('express')
var debug = require('debug')('express-lru:server')
var app = express()
var port = process.env.PORT || 3000

var server = app.listen(port) // eslint-disable-line
debug(`Listening on tcp://localhost:${port}`)

module.exports = { app, server }
