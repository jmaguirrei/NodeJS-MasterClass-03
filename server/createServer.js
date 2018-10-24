

// Dependencies
const url = require('url');
const handlers = require('../lib/handlers');
const StringDecoder = require('string_decoder').StringDecoder;
const helpers = require('../lib/helpers');

// createServer
module.exports = function createServer(req, res) {

  // parse url (returns an object)
  const parsedUrl = url.parse(req.url, true); // true: use query string module

  // get path from the url
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, ''); // removes extra slashes...

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload,if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', data => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {

    buffer += decoder.end();

    // Choose the handler, use notFound if not found
    const chosenHandler = trimmedPath.indexOf('public/') > -1
      ? handlers.public
      : handlers[trimmedPath] || handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer)
    };

    chosenHandler(data, (statusCode, payload, contentType = 'json') => {

      // use status code of the handler or default to 200
      const resultingStatusCode = typeof statusCode === 'number' ? statusCode : 200;

      // Return the response parts that are content-type specific
      let payloadString = '';
      if (contentType === 'json') {
        res.setHeader('Content-Type', 'application/json');
        const resultingPayload = typeof payload === 'object' ? payload : {};
        payloadString = JSON.stringify(resultingPayload);
      }

      if (contentType === 'html') {
        res.setHeader('Content-Type', 'text/html');
        payloadString = typeof payload === 'string' ? payload : '';
      }

      if (contentType === 'favicon') {
        res.setHeader('Content-Type', 'image/x-icon');
        payloadString = typeof payload !== 'undefined' ? payload : '';
      }

      if (contentType === 'plain') {
        res.setHeader('Content-Type', 'text/plain');
        payloadString = typeof payload !== 'undefined' ? payload : '';
      }

      if (contentType === 'css') {
        res.setHeader('Content-Type', 'text/css');
        payloadString = typeof payload !== 'undefined' ? payload : '';
      }

      if (contentType === 'png') {
        res.setHeader('Content-Type', 'image/png');
        payloadString = typeof payload !== 'undefined' ? payload : '';
      }

      if (contentType === 'jpg') {
        res.setHeader('Content-Type', 'image/jpeg');
        payloadString = typeof payload !== 'undefined' ? payload : '';
      }

      // Return the response
      // res.setHeader('Access-Control-Allow-Origin', '*');
      res.writeHead(resultingStatusCode);
      res.end(payloadString);

    });

  });

};
