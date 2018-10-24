

// Dependencies
const _data = require('../../data');
const helpers = require('../../helpers');
const tokens = require('./tokens');
const menuItems = require('../../../.data/menu/items');

// getAmountAndItems
function getAmountAndDesc(order) {

  return Object.keys(order).reduce((acum, key) => {
    const value = Number(order[key]);
    const findMenuItem = menuItems.find(item => item.code === key);
    if (value === 0) return acum;
    return {
      amount: acum.amount + value * findMenuItem.price,
      description: `${acum.description} (${value}) ${findMenuItem.type} - ${findMenuItem.name}`,
    };
  }, { amount: 0, description: '' });

}

// orderHandlers
module.exports = {

  post(data, callback) {
    // check required fields
    if (!data.payload) callback(400, { Error: 'Missing required fields '});
    const {
      email,
      order = {},
    } = data.payload;

    if (email && order) {
      // Make sure user exists
      _data.read('users', email, (err1, userData) => {
        if (!err1 && userData) {
          // Get token from headers
          const token = typeof data.headers.token === 'string' ? data.headers.token : false;

          // Verify that the given token is valid for the phone number
          tokens.verifyToken(token, email, function (tokenIsValid) {
            if (tokenIsValid) {
              const orderId = helpers.createRandomString(20);
              const { amount, description } = getAmountAndDesc(order);
              const orderData = {
                user: {
                  name: userData.name,
                  email,
                  address: userData.address,
                },
                order: {
                  id: orderId,
                  original: order,
                  amount,
                  description,
                },
              };
              const fileName = orderId;
              _data.create('orders', fileName, orderData, err2 => {
                if (!err2) {
                  callback(200, { orderId });
                } else {
                  callback(500, { Error: 'Could not create the new order '});
                }
              });
            } else {
              callback(403, { Error: 'Token is not valid' });
            }
          });

        } else {
          callback(400, { Error: 'User does not exists '});
        }
      });
    } else {
      callback(400, { Error: 'Missing required fields '});
    }
  },


};

