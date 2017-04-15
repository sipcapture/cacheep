var dns = require('node-dns'),
  dns_server = dns.createServer();

var cache = require('./db');

var dns_port = process.env.DNS_PORT || 53;
var dns_host = process.env.DNS_HOST || '127.0.0.1';

dns_server.on('request', function (request, response) {

  /* Parse Query Name */
  var name = request.question[0].name;
  if (!name || !name.endsWith("e164.arpa")) { response.send(); return; }
  /* Resolve Target Number */
  var target = name.replace("e164.arpa","").split(".").join("").split("").reverse().join("");

   if(cache.get(target)){
	  // NULL
	  response.additional.push(dns.NAPTR({
	          ttl: 300,
	          name: name,
	          order: 10,
	          preference: 100,
	          flags: 'u',
	          service: 'E2U+sip',
	          regexp: '!^.*$!sip:'+target+'@invalid!',
	          replacement:''
	  }));
	  response.send();

   } else {
	  // 404
	  response.send();
   }
});

dns_server.on('error', function (err, buff, req, res) {
  console.log(err.stack);
});

dns_server.serve(dns_port,dns_host);

// module.exports = dns_server

module.exports = app => dns_server;

