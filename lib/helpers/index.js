/*
 * Helpers for various tasks
 *
 */

// Dependencies
const createRandomString = require('./createRandomString');
const hash = require('./hash');
const makePayment = require('./makePayment');
const parseJsonToObject = require('./parseJsonToObject');
const sendEmail = require('./sendEmail');
const getTemplate = require('./getTemplate');
const getStaticAsset = require('./getStaticAsset');

module.exports = {

  createRandomString,
  hash,
  makePayment,
  parseJsonToObject,
  sendEmail,
  getTemplate,
  getStaticAsset,

};

