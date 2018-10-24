

// Dependencies
const _data = require('../../data');
const helpers = require('../../helpers');

// tokenHandlers
module.exports = {

  post(data, callback) {
    // check required fields
    if (!data.payload) callback(400, { Error: 'Missing required fields '});
    const {
      email,
    } = data.payload;
    if (email) {
      // Make sure user does not exists yet
      _data.read('users', email, (err1, userData) => {
        if (!err1 && userData) {
          // 1-hour token
          const tokenId = helpers.createRandomString(20);
          const expires = Date.now() + 1000 * 60 * 60;
          const tokenObject = {
            name: userData.name,
            email,
            id: tokenId,
            expires
          };
          _data.create('tokens', tokenId, tokenObject, err => {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, { Error: 'Could not create token' });
            }
          });
        } else {
          callback(400, { Error: 'User not found' });
        }
      });
    } else {
      callback(400, { Error: 'Missing required fields '});
    }
  },

  get(data, callback) {
    // token id required
    // only logged user can access data
    if (!data.queryStringObject) callback(400, { Error: 'Missing required fields '});
    const {
      id,
    } = data.payload;

    if (id) {
      _data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
          // Remove hashed password for security reasons
          callback(200, tokenData);
        } else {
          callback(404);
        }
      });
    } else {
      callback(400, { Error: 'Missing token' });
    }
  },

  put(data, callback) {
    // phone required + 1 or more additional fields
    // check required fields
    if (!data.payload) callback(400, { Error: 'Missing required fields '});
    const {
      id,
      extend = false,
    } = data.payload;
    // Check optional fields
    if (id && extend) {
      // Lookup token
      _data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
          // Remove hashed password for security reasons
          if (tokenData.expires > Date.now()) {
            tokenData.expires = Date.now() + 1000 * 60 * 60;
            _data.update('tokens', id, tokenData, err2 => {
              if (!err2) {
                callback(200);
              } else {
                callback(500, { Error: 'Could not update expiration' });
              }
            });
          } else {
            callback(400, { Error: 'Token expired cannot be extended' });
          }
        } else {
          callback(404, { Error: 'Token doesnt exists' });
        }
      });
    } else {
      callback(400, { Error: 'Missing required field' });
    }

  },

  delete(data, callback) {
    // check required fields
    if (!data.payload) callback(400, { Error: 'Missing required fields '});
    const {
      id,
    } = data.payload;
    if (id) {
      _data.read('tokens', id, (err1, data2) => {
        if (!err1 && data2) {
          // Update fields
          _data.delete('tokens', id, err2 => {
            if (!err2) {
              callback(200);
            } else {
              callback(500, { Error: 'Could not delete the token '});
            }
          });
        } else {
          callback(400, { Error: 'The token does not exists' });
        }
      });
    } else {
      callback(400, { Error: 'Missing required field' });
    }
  },

  verifyToken(id, email, callback) {
    if (!id) {
      callback(false);
    } else {
      _data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
          // Token of current user && not expired
          if (tokenData.email === email && tokenData.expires > Date.now()) {
            callback(true);
          } else {
            callback(false);
          }
        } else {
          callback(false);
        }
      });
    }
  },

};

