/*
 * Helpers for various tasks
 *
 */

// Dependencies
const config = require('../config');
const crypto = require('crypto');

module.exports = function hash(str) {

  if (typeof str === 'string' && str.length > 0) {
    const hashed = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hashed;
  }
  return false;

};

