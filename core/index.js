var app = require('./app').app

// load modules
require('./http')(app)
require('./dns')(app)
require('./logger')(app)
require('./routes')(app)

module.exports = app
