var LRU = require("lru-cache")
  , options = { max: process.env.MAX || 10000
              , length: function (n, key) { return n * 2 + key.length }
	      , dispose: function (key, n) { return key.length }
              , maxAge: 1000 * 60 * 60 }
  , cache = LRU(options)

// Data Management
var fs = require('fs');
var savePath = process.env.FILE;
    // Reload Cache
    if (savePath){
	if (fs.existsSync(savePath)) {
	    console.log('FILE: Found backup!');
		fs.readFile(savePath, 'utf8', function (err, data) {
			if (!data) return;
			cache.load(JSON.parse(data));
		});
	}
    }

process.on('SIGINT', function() {
    // Save Cache
    if (savePath){
   	fs.writeFile (savePath, JSON.stringify(cache.dump()), function(err) {
                if (err) throw err;
                console.log('FILE: dump complete!');
		console.log('Exiting...');
    		process.exit();
        });
    } else {
		console.log('Exiting...');
    		process.exit();
    }
});

module.exports = cache
