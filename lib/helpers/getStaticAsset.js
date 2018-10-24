
// Dependencies
const path = require('path');
const fs = require('fs');

// Main export
module.exports = function getStaticAsset(fileName = '', callback) {

  // Get the contents of a static (public) asset
  const validFileName = fileName.length > 0 ? fileName : false;
  if (validFileName) {
    var publicDir = path.join(__dirname,'/../../public/');
    fs.readFile(publicDir + validFileName, (err, data) => {
      if (!err && data) {
        callback(false, data);
      } else {
        callback('No file could be found');
      }
    });
  } else {
    callback('A valid file name was not specified');
  }
};

