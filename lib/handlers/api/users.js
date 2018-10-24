

// Dependencies
const _data = require('../../data');
const helpers = require('../../helpers');
const tokens = require('./tokens');


// userHandlers
module.exports = {

  post(data, callback) {
    // check required fields
    if (!data.payload) callback(400, { Error: 'Missing required fields '});
    const {
      name,
      email,
      address,
      password,
      tosAgreement = false,
    } = data.payload;
    if (name && email && address && password && tosAgreement) {
      // Make sure user does not exists yet
      _data.read('users', email, err1 => {
        if (err1) {
          // Store the user
          const userObject = {
            name,
            email,
            address,
            hashedPassword: helpers.hash(password),
            tosAgreement: true,
          };
          _data.create('users', email, userObject, err2 => {
            if (!err2) {
              callback(200);
            } else {
              callback(500, { Error: 'Could not create the new user '});
            }
          });
        } else {
          callback(400, { Error: 'User already exists '});
        }
      });
    } else {
      callback(400, { Error: 'Missing required fields '});
    }
  },

  get(data, callback) {
    // only logged user can access data
    // check required fields
    if (!data.payload) callback(400, { Error: 'Missing required fields '});
    const {
      email,
    } = data.payload;
    if (email) {

      // Get the token from the headers
      const token = typeof data.headers.token === 'string' ? data.headers.token : false;
      tokens.verifyToken(token, email, tokenIsValid => {
        if (tokenIsValid) {
          _data.read('users', email, (err, data2) => {
            if (!err && data2) {
              callback(200, data2);
            } else {
              callback(404);
            }
          });
        } else {
          callback(403, { Error: 'Token invalid' });
        }
      });
    } else {
      callback(400, { Error: 'Missing phone number' });
    }
  },

  put(data, callback) {
    // check required fields
    if (!data.payload) callback(400, { Error: 'Missing required fields '});
    const {
      name,
      email,
      address,
    } = data.payload;
    if (email) {
      // Check optional fields
      if (name || address) {
        _data.read('users', email, (err1, data2) => {
          if (!err1 && data2) {
            // Update fields
            // Get token from headers
            const token = typeof data.headers.token === 'string' ? data.headers.token : false;

            // Verify that the given token is valid for the phone number
            tokens.verifyToken(token, email, function (tokenIsValid) {
              if (tokenIsValid) {
                if (name) data2.name = name;
                if (address) data2.address = address;
                _data.update('users', email, data2, err2 => {
                  if (!err2) {
                    callback(200);
                  } else {
                    callback(500, { Error: 'Could not update the user '});
                  }
                });
              } else {
                callback(403, { Error: 'Token invalid' });
              }
            });

          } else {
            callback(400, { Error: 'The user does not exists' });
          }
        });
      } else {
        callback(400, { Error: 'Missing field to update' });
      }
    } else {
      callback(400, { Error: 'Missing required field' });
    }

  },

  delete(data, callback) {
    // check required fields
    if (!data.payload) callback(400, { Error: 'Missing required fields '});
    const {
      email,
    } = data.payload;
    if (email) {
      _data.read('users', email, (err1, data2) => {
        if (!err1 && data2) {
          // Update fields
            // Get token from headers
            const token = typeof data.headers.token === 'string' ? data.headers.token : false;

            // Verify that the given token is valid for the phone number
            tokens.verifyToken(token, email, function (tokenIsValid) {
              if (tokenIsValid) {
                _data.delete('users', email, err2 => {
                  if (!err2) {
                    callback(200);
                  } else {
                    callback(500, { Error: 'Could not delete the user '});
                  }
                });
              } else {
                callback(403, { Error: 'Token invalid' });
              }
            });
        } else {
          callback(400, { Error: 'The user does not exists' });
        }
      });
    } else {
      callback(400, { Error: 'Missing required field' });
    }
  },

};

