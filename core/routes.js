var express = require('express')
var debug = require('debug')('express-lru:routes')
var router = express.Router()
var bodyParser = require('body-parser');

var cache = require('./db')

/* Router Settings */

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.all('*',function(req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
    next();
});

router.get('/ping', (req, res) => {
	if (cache) res.sendStatus(200)
	else res.sendStatus(500)
})

/* 	SET DATA (POST)
	Set Key Value or Key {Object} with optional TTL parameter.
*/

router.post('/api/set/:key/:ttl?', (req, res) => {
  try {
	if (req.body) {
		if (req.params.ttl) cache.set(req.params.key, req.body, req.params.ttl);
		else cache.set(req.params.key, req.body);
		res.sendStatus(200)
	} else { res.sendStatus(500) }
  } catch(e) {
	console.log(e)
	res.sendStatus(500)
  }
})

/* 	SET DATA (GET)
	Set Key Value or Key {Object} with optional TTL parameter.
*/

router.get('/api/set/:key/:value', (req, res) => {
  try {
	cache.set(req.params.key, req.params.value);
	res.sendStatus(200)
  } catch(e) {
	console.log(e)
	res.sendStatus(500)
  }
})

router.get('/api/set/:key/:value/:ttl', (req, res) => {
  try {
	cache.set(req.params.key, req.params.value, req.params.ttl);
	res.sendStatus(200)
  } catch(e) {
	console.log(e)
	res.sendStatus(500)
  }
})

/* 	GET DATA 
	Both of these will update the "recently used"-ness of the key. 
	They do what you think. maxAge is optional and overrides the cache maxAge option if provided.
*/

router.get('/api/get/:key/:value?', (req, res) => {
  try {
	if (req.params.value) res.send( (cache.get(req.params.key))[req.params.value] )
	else res.send(cache.get(req.params.key))

  } catch(e) {
	console.log(e)
	res.sendStatus(500);
  }
})

/* 	PEEK DATA 
	Returns the key value (or undefined if not found) without updating the "recently used"-ness of the key.
*/

router.get('/api/peek/:key', (req, res) => {
  try {
	res.send(cache.peek(req.params.key))

  } catch(e) {
	console.log(e)
	res.sendStatus(500);
  }
})

/* 	HAS DATA 
	Check if a key is in the cache, without updating the recent-ness or deleting it for being stale.
*/

router.get('/api/has/:key', (req, res) => {
  try {
	res.send(cache.has(req.params.key))

  } catch(e) {
	console.log(e)
	res.sendStatus(500);
  }
})


/* 
	UNSET DATA 
	Deletes a key out of the cache.
*/

router.get('/api/unset/:key', (req, res) => {
  try {
	cache.del(req.params.key)
	res.sendStatus(200)
  } catch(e) {
	console.log(e)
	res.sendStatus(500)
  }
})

/* 
	RESET DATA 
	Clear the cache entirely, throwing away all values.
*/

router.get('/api/reset/all', (req, res) => {
  try {
	cache.reset()
	res.sendStatus(200)
  } catch(e) {
	console.log(e)
	res.sendStatus(500)
  }
})

/* 
	PRUNE DATA 
	Manually iterates over the entire cache proactively pruning old entries.
*/

router.get('/api/prune/all', (req, res) => {
  try {
	cache.prune()
	res.sendStatus(200)
  } catch(e) {
	console.log(e)
	res.sendStatus(500)
  }
})

/* 
	DUMP/RELOAD DATA
	Manually dump and reload cache serialized objects.
*/

router.post('/api/dump', (req, res) => {
  try {
	res.status(200).send( cache.dump() )
  } catch(e) {
	console.log(e)
	res.sendStatus(500)
  }
})

router.post('/api/load', (req, res) => {
  try {
	if (req.body) {
		cache.load(req.body);
		res.sendStatus(200)
	} else { res.sendStatus(500) }
  } catch(e) {
	console.log(e)
	res.sendStatus(500)
  }
})

/* Export */

module.exports = app => {
  app.use('/', router)
}
