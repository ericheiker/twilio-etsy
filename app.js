
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , https = require('https')
  , path = require('path');

var app = express();

var accountSid = 'ACbb35fa5283bd768e8a17cb8cd3173179';
var authToken = "b3989bca327bad43c8e7dbba20bd1c51";
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

app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

app.post('/hello', function(req, res) {
  res.render('hello', { message: req.body.message });
});

app.get('/', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!', name: "Eric" });
});

app.get('/battlecat', function(req, res) {

  var options = {
  	host: 'openapi.etsy.com',
  	port: '443',
  	path: '/v2/listings/175112598?api_key=ajqa1iqt78qgh21kllan0ti5',
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
  		res.render('battlecat', {"description" : listingResponse.results[0].description})
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

	res.render('hello', { message: "I Posted something!"});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
