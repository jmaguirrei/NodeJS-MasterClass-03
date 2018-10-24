

// Dependencies
const userHandlers = require('./api/users');
const tokenHandlers = require('./api/tokens');
const orderHandlers = require('./api/order');
const paymentHandlers = require('./api/payment');
const allPagesHandler = require('./pages/allPages');
const publicHandler = require('./static/public');
const faviconHandler = require('./static/favicon');

// notFound
function notFound(data, callback) {
  callback(404);
}


// users
function users(data, callback) {
  const methods = [ 'post', 'get', 'put', 'delete' ];
  if (methods.indexOf(data.method) > -1) {
    userHandlers[data.method](data, callback);
  } else {
    callback(405);
  }
}

// order
function order(data, callback) {
  const methods = [ 'post' ];
  if (methods.indexOf(data.method) > -1) {
    orderHandlers[data.method](data, callback);
  } else {
    callback(405);
  }
}

// payment
function payment(data, callback) {
  const methods = [ 'post' ];
  if (methods.indexOf(data.method) > -1) {
    paymentHandlers[data.method](data, callback);
  } else {
    callback(405);
  }
}

// tokens
function tokens(data, callback) {
  const methods = [ 'post', 'get', 'put', 'delete' ];
  if (methods.indexOf(data.method) > -1) {
    tokenHandlers[data.method](data, callback);
  } else {
    callback(405);
  }
}


// Handlers
module.exports = {
  notFound,
  '': allPagesHandler('home'),
  error: allPagesHandler('error'),
  'account/create': allPagesHandler('accountCreate'),
  'account/login': allPagesHandler('accountLogin'),
  menu: allPagesHandler('menu'),
  'order/cart': allPagesHandler('orderCart'),
  'order/success': allPagesHandler('orderSuccess'),
  'api/users': users,
  'api/tokens': tokens,
  'api/order': order,
  'api/payment': payment,
  'favicon.ico': faviconHandler,
  public: publicHandler,
};

