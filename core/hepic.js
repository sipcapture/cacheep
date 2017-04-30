/* HEPIC Connector 1.0       */
/* (C) 2017 QXIP BV          */
/* lorenzo.mangani@gmail.com */

var request = require('request')
var jar = request.jar();

var api_url 	= process.env.HEPIC_URL || ''; 
var apiUser 	= process.env.HEPIC_USER || 'admin';
var apiPass 	= process.env.HEPIC_PASS || 'password';
var timeOut 	= 1800;

var api_call  	= '/api/v2/search/call/data';
var api_trans 	= "/api/v2/call/transaction";

var HEPcookie = request.cookie("PCAPTURESESSION="+Math.random().toString(36).slice(2)+";path=/");
jar.setCookie(HEPcookie, api_url+"/api/v2/session", function(error, cookie) {});

var getHepic = function(postData,callback){

	var options = {
		method: 'post',
		body: postData,
		json: true,
		url: api_url + api_call,
		jar: jar,
		headers: {
		        'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
			'Accept': '/',
			'Connection': 'keep-alive'
		}
	};

	request(options, function (err, res, body) {
			if (err) {
				console.error('error posting json: ', err);
				throw err;
			}
			var headers = res.headers;
			var statusCode = res.statusCode;
			// console.log('headers: ', headers);
			// console.log('statusCode: ', statusCode);
			// console.log('body: ', body.data);
			if (body.data.length <1) { callback(null); return; }
			options.url = api_url + api_trans;
			var last;
			for (var key in body.data) {
			    var mydata = body.data[key];
                            options.body.param.search = {};
			    options.body.param.search.callid = [];
			    options.body.param.search.callid.push(mydata.callid);
			    request(options, function (err2, res2, body2) {
			                if (err2) {
          				        console.error('error posting json: ', err2);
          				        throw err2;
                                        }
                                        var headers2 = res2.headers;
                                        var statusCode2 = res2.statusCode;
                                        for (var key2 in body2.data.messages) {
                                                 var md = body2.data.messages[key2];
                                                 if(md.reply_reason == 200)
                                                        {
								/* magic */
								callback(md);
								last = md;
                                                        }
                                        }
                            });
		        };
			return last;
	});
}

/* Functions */

var getAuth = function(){

    var auth = JSON.stringify({ "username": apiUser, "password": apiPass });
    request({
	  uri: api_url+"/api/v2/session",
	  method: "POST",
	  form: auth,
	  jar: jar
	}, function(error, response, body) {
          if (!body) {
		console.log('API Error connecting to '+apiUrl);
		console.log('Exiting...',error);
		process.exit(1);
	  } else {
		if (response.statusCode == 200){
			var status = JSON.parse(response.body).auth;
			if (!status){
				  console.log('API Auth Failure!', status); process.exit(1);
			}
		}
	  }
    });

    return;

}

var doAuth = function(){
	getAuth();
	setInterval(function() {
	    getAuth();
	}, timeOut*1000 );
}


module.exports = {
   test: function() { return "OK" },
   get: getHepic,
   auth: doAuth,
}

