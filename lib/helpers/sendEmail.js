
// Dependencies
const https = require('https');
const querystring = require('querystring');
const config = require('../config');


module.exports = function sendEmail(data, callback) {

  const payload = {
    from: config.mailgun.from,
    to: data.to,
    subject: data.subject,
    text: data.text,
  };

  const stringPayload = querystring.stringify(payload);

  const requestDetails = {
    auth: 'api:' + config.mailgun.apiKey,
    protocol: 'https:',
    hostname: 'api.mailgun.net',
    method: 'POST',
    path: '/v3/' + config.mailgun.domainName + '/messages',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(stringPayload)
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
