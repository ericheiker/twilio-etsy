
/**
 * Need to set the following environment variables before this will run:
 * TWILIO_SID
 * TWILIO_AUTH
 * ETSY_AUTH
 */

var express = require('express')
  , http = require('http')
  , https = require('https')
  , path = require('path');

var app = express();

var accountSid = process.env.TWILIO_SID;
var authToken = process.env.TWILIO_AUTH;
var twilioClient = require('twilio')(accountSid, authToken);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
  
});

app.get('/battlecat', function(req, res) {
  var etsyAuth = process.env.ETSY_AUTH;
  console.log(etsyAuth);
  var options = {
  	host: 'openapi.etsy.com',
  	port: '443',
  	path: '/v2/listings/175112598?api_key=' + etsyAuth + '&includes=MainImage',
  	method: 'GET'
  };

  console.log("sending request" + https);

  var body = '';
  var req = https.request(options, function(etsyRes) {
  	console.log('STATUS: ' + etsyRes.statusCode);
  	console.log('HEADERS: ' + etsyRes.headers);
  	etsyRes.setEncoding('utf8');

  	etsyRes.on('data', function(chunk) {
  		//console.log('BODY: ' + chunk);
  		body  += chunk;
  	});

  	etsyRes.on('end', function() {
  		var listingResponse = JSON.parse(body);
  		console.log("Got response ", listingResponse.results[0].description);
  		var listing = listingResponse.results[0]
  		res.render('battlecat', {
  			"title" : listing.title
  			, "description" : listing.description
  			, "url" : listing.url
  			, "price" : listing.price + listing.currency_code
  			, "mainImage" : listing.MainImage.url_570xN })
  	});
  });

  req.end();

  req.on('error', function(e) {
  	console.error(e);
  });

  
});

app.post('/echo', function(req, res) {
	res.set('Content-Type', 'text/plain');
	res.send('echoing: ' + req.body.message);
});

app.post('/sendSMS', function(req, res) {
	sendSMS(req);

	res.redirect('battlecat');
});

function sendSMS(req) {
	twilioClient.sms.messages.create({
	    body: req.body.message,
	    to: "+14085151441",
	    from: "+14089229803"
	}, function(err, message) {
	    if (err) {
	      console.log("error " + err);
	    } else { 
	      console.log("message " + message); 
	    }
	});
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
