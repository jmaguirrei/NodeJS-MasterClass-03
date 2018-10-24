
const helpers = require('../../helpers');

// Public assets
module.exports = function (data, callback) {

  // Reject any request that isn't a GET
  if (data.method === 'get') {
    // Get the filename being requested
    const trimmedAssetName = data.trimmedPath.replace('public/','').trim();
    if (trimmedAssetName.length > 0) {

      // Read in the asset's data
      helpers.getStaticAsset(trimmedAssetName, (err, data2) => {
        if (!err && data2) {

          // Determine the content type (default to plain text)
          let contentType = 'plain';

          if (trimmedAssetName.indexOf('.css') > -1) {
            contentType = 'css';
          }


          if (trimmedAssetName.indexOf('.png') > -1) {
            contentType = 'png';
          }

          if (trimmedAssetName.indexOf('.jpg') > -1) {
            contentType = 'jpg';
          }

          if (trimmedAssetName.indexOf('.ico') > -1) {
            contentType = 'favicon';
          }

          // Callback the data
          callback(200, data2, contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }

  } else {
    callback(405);
  }

};

