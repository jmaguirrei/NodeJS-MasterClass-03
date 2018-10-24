

// Dependencies
const _data = require('../../data');
const helpers = require('../../helpers');

// paymentHandlers
module.exports = {

  post(data, callback) {
    // check required fields
    if (!data.payload) callback(400, { Error: 'Missing required fields '});
    const {
      orderId,
    } = data.payload;

    if (orderId) {
      // Make sure user exists
      _data.read('orders', orderId, (err1, orderData) => {
        if (!err1 && orderData) {
          const amount = orderData.order.amount;
          const description = orderData.order.description;
          const email = orderData.user.email;
          const paymentDetails = {
            amount,
            currency: 'usd',
            source: 'tok_visa_debit',
            description: 'Thanks for ordering at Pepe\'s pizza!',
          };
          helpers.makePayment(paymentDetails, err3 => {
            if (!err3) {
              const mailDetail = {
                to: email,
                subject: 'Success! Your order is confirmed',
                text: `You will receive your order [ ${description} ] in 1 hour`,
              };
              helpers.sendEmail(mailDetail, err4 => {
                if (!err4) {
                  callback(200);
                } else {
                  callback(500, { Error: 'Could not send email '});
                }
              });
            } else {
              callback(500, { Error: 'Could not make payment '});
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

