var morgan = require('morgan')

module.exports = app => {
  app.use(morgan('dev'))
}
