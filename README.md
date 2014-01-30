# Twilio-Etsy

The idea behind this app is to allow Etsy users to send messages to a seller, without needing to know their phone number. In future versions sellers could allow or disallow communication methods (SMS, voicemail, etc). The seller could respond through Twilio.

Currently this project serves as a way to familiarize myself with the Express.js framework and the Twilio API.

## Technologies used in this app

* Express.js - Web application server
* Bootstrap - Front end framework
* Forever - keeps node.js server running in background on server
* Nodemon - monitors node application in dev environment and reloads any changes
* Git - source control
* GitHub - to host the code
* DigitalCloud - to host the app
* Twilio API - cloud communications to send SMS through the web
* Etsy API - DIY marketplace


## Next Steps

* Before going any further, look into unit testing framework. Mocha looks promising http://visionmedia.github.io/mocha/
* Change routes to be more RESTful (e.g. GET /listing, POST /message etc). Too RPC-like at the moment
* Set up Nginx as a reverse proxy
* Set up memcached to cache listing data (doesn't really change). Can also look into caching the more static sections of the page with another solution
* See if can use TwiML to capture the response from the seller and redirect to the buyer's phone
