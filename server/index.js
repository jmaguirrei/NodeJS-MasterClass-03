

// Dependencies
const http = require('http');
const https = require('https');
const createServer = require('./createServer');
const config = require('../lib/config');

const httpServer = http.createServer(createServer);
const httpsServer = https.createServer(createServer);

// Start the server and listen
httpServer.listen(config.httpPort, () => {
  console.log('Listening on port', config.httpPort);
});
// Start the server and listen
httpsServer.listen(config.httpsPort, () => {
  console.log('Listening on port', config.httpsPort);
});

