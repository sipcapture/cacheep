var express = require('express')
var debug = require('debug')('cacheep:routes')
var router = express.Router()
var bodyParser = require('body-parser');

var REDIS_ENABLE = true;

var cache = require('./db')

if(REDIS_ENABLE) var redisdb = require('./redis-db')

var HEPIC = process.env.HEPIC || false;
if (HEPIC) {
	var teardown = require('./teardown')
	var hepic = require('./hepic')
	hepic.auth();
}

var GUN = process.env.GUN || false;
if (GUN) {
	var gun = require('./gundb')
	var data = gun.get('data')
}

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
		if (req.params.ttl) {
		    cache.set(req.params.key, req.body, req.params.ttl);
		    if(REDIS_ENABLE) redisdb.set(req.params.key, JSON.stringify(req.body), 'EX', req.params.ttl/1000);
                }
		else {
		    cache.set(req.params.key, req.body);
		    if(REDIS_ENABLE) redisdb.set(req.params.key, JSON.stringify(req.body));
                }
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

	if(REDIS_ENABLE) redisdb.set(req.params.key, req.params.value);
	
	res.sendStatus(200)
  } catch(e) {
	console.log(e)
	res.sendStatus(500)
  }
})

router.get('/api/set/:key/:value/:ttl', (req, res) => {
  try {
	cache.set(req.params.key, req.params.value, req.params.ttl);

  	if(REDIS_ENABLE) redisdb.set(req.params.key, req.params.value, 'EX', req.params.ttl/1000);

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
        else {
            var resp = {};
            var data = cache.get(req.params.key);
            if(data === undefined ) resp.blocked = false;
            else {
                resp.blocked = true;
                resp.data = data;
            }
            res.send(resp);
        }

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


router.post('/api/teardown/user', (req, res) => {
	var postData = req.body;

	hepic.get(postData,function(gotData,b){
		console.log('DATA:',gotData,b);
		res.sendStatus(200);
	})

})

router.get('/api/teardown/user/from/:user/:minutes?', (req, res) => {

	var seconds = req.params.minutes ? (60 * req.params.minutes) : (60 * 60);
	var postData = {
                    	param: {
                                    transaction:{},
                                    limit:100,
                                    search: {
                                      from_user:req.params.user,
                                      status: 5
                                    },
                        	    location:{},
                        	    timezone:{
                                      value:-120,
                                      name: "GMT+2 EET",
                                      offset:"+0200"
                                    }
                               },
                        timestamp:{
                                  from: new Date( (new Date()).getTime() - 1000 * seconds ).getTime(),
                                  to: new Date().getTime()
                                }
        };

	hepic.get(postData, function(md){
		 if (!md) { res.sendStatus(404); return; }
		 var tears = teardown.parse(md);
		 teardown.send(md.source_ip,md.source_port,tears.aleg);
		 teardown.send(md.destination_ip,md.destination_port,tears.bleg);
		 res.sendStatus(200);
	});

})


/* Export */

module.exports = app => {
  app.use('/', router)
}
