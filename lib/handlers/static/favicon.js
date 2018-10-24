
const helpers = require('../../helpers');

// Home page template handler
module.exports = function (data, callback) {

  // Reject any request that isn't a GET
  if (data.method === 'get') {
    // Read in the favicon's data
    helpers.getStaticAsset('favicon.ico', (err, data2) => {
      if (!err && data2) {
        // Callback the data
        callback(200, data2, 'favicon');
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }

};

