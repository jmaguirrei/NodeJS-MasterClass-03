
// Dependencies
const https = require('https');
const querystring = require('querystring');
const config = require('../config');


module.exports = function makePayment(data, callback) {

  const payload = {
    amount: data.amount * 100, // amount in cents
    currency: data.currency,
    source: data.source,
    description: data.description
  };

  const stringPayload = querystring.stringify(payload);

  const requestDetails = {
    protocol: 'https:',
    hostname: 'api.stripe.com',
    port: 443,
    method: 'POST',
    path: '/v1/charges',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(stringPayload),
      Authorization: `Bearer ${config.stripe.secretKey}`
    }
  };

  // Instantiate the request object
  const req = https.request(requestDetails, res => {
    // Grab the status of the sent request
    const status = res.statusCode;
    // Callback successfully if the request went through
    if (status === 200 || status === 201) {
      callback(false);
    } else {
      callback('Status code returned was ' + status);
    }
  });

  // Bind to the error event so it doesn't get thrown
  req.on('error', err => {
    callback(err);
  });

  // Add the payload
  req.write(stringPayload);

  // End the request
  req.end();

};
