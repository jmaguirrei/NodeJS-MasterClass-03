
// Dependencies
const path = require('path');
const fs = require('fs');
const config = require('../config');


// Local helper interpolate
function interpolate(str = '', data = {}) {

  // Take a given string and data object, and find/replace all the keys within it
  let validStr = str.length > 0 ? str : '';

  // Add the templateGlobals to the data object, prepending their key name with "global."
  for (let keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      data['global.' + keyName] = config.templateGlobals[keyName];
    }
  }

  // For each key in the data object, insert its value into the string at the corresponding placeholder
  for (let key in data) {
    if (data.hasOwnProperty(key) && typeof data[key] === 'string') {
      const replace = data[key];
      const find = '{' + key + '}';
      validStr = validStr.replace(find,replace);
    }
  }
  return validStr;

}

// Main export
module.exports = function getTemplate(templateName = '', data = {}, callback) {

  // Get the string content of a template, and use provided data for string interpolation
  const validTemplateName = templateName.length > 0 ? templateName : false;
  if (validTemplateName) {
    const templatesDir = path.join(__dirname, '/../../templates/');
    /* eslint-disable no-sync */
    const str = fs.readFileSync(templatesDir + validTemplateName + '.html', 'utf8');
    if (str) {
      const finalString = interpolate(str, data);
      callback(false, finalString);
    } else {
      callback('No template could be found');
    }
    // fs.readFile(templatesDir + validTemplateName + '.html', 'utf8', (err, str) => {
    //   if (!err && str && str.length > 0) {
    //     // Do interpolation on the string
    //     const finalString = interpolate(str, data);
    //     callback(false, finalString);
    //   } else {
    //     callback('No template could be found');
    //   }
    // });
  } else {
    callback('A valid template name was not specified');
  }

};

