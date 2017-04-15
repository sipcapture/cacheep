var LRU = require("lru-cache")
  , options = { max: process.env.MAX || 10000
              , length: function (n, key) { return n * 2 + key.length }
	      , dispose: function (key, n) { return key.length }
              , maxAge: 1000 * 60 * 60 }
  , cache = LRU(options)

module.exports = cache
