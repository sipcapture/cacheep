var dns = require('node-dns'),
  dns_server = dns.createServer();

var cache = require('./db');

var dns_port = process.env.DNS_PORT || 53;
var dns_host = process.env.DNS_HOST || '127.0.0.1';
var dns_root = process.env.DNS_ROOT || 'e164.arpa'

dns_server.on('request', function (request, response) {

  /* Parse Query Name */
  var name = request.question[0].name;
  if (!name || !name.endsWith(dns_root)) { response.send(); return; }
  /* Resolve Target Number */
  var target = name.replace(dns_root,"").split(".").join("").split("").reverse().join("");

  for (var i = target.length, len = 0; i > len; i--) {
     if (cache.get(target.substring(0,i))) {
		// console.log('MATCH!',target);
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
		return;
     }
  }

  response.send();

});

dns_server.on('error', function (err, buff, req, res) {
  console.log(err.stack);
});

dns_server.serve(dns_port,dns_host);

/* Export */

module.exports = app => dns_server;

