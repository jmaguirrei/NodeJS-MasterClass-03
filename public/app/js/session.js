/*
 * Frontend Logic for application
 *
 */


// Set (or remove) the loggedIn class from the body
window.app.setLoggedInClass = function (add) {
  const body = document.querySelector('body');
  const helloUser = document.querySelector('.helloUser');
  if (add) {
    body.classList.remove('notLogged');
    body.classList.add('logged');
    const tokenObject = JSON.parse(window.localStorage.getItem('token'));
    if (typeof tokenObject.name === 'string') {
      helloUser.innerHTML = `Hello ${tokenObject.name}`;
    }
  } else {
    body.classList.remove('logged');
    body.classList.add('notLogged');
  }

};

// Set the session token in the app.config object as well as localstorage
window.app.setSessionToken = function (token) {

  window.app.config.sessionToken = token;

  const tokenString = JSON.stringify(token);
  window.localStorage.setItem('token', tokenString);
  if (typeof token === 'object') {
    window.app.setLoggedInClass(true);
  } else {
    window.app.setLoggedInClass(false);
  }
};

window.app.getSessionToken = function () {
  const tokenString = window.localStorage.getItem('token');
  if (typeof tokenString === 'string') {
    try {
      const token = JSON.parse(tokenString);
      window.app.config.sessionToken = token;
      if (typeof token === 'object') {
        window.app.setLoggedInClass(true);
      } else {
        window.app.setLoggedInClass(false);
      }
    } catch(e) {
      window.app.config.sessionToken = false;
      window.app.setLoggedInClass(false);
    }
  }
};


window.app.logUserOut = function () {

  // Get the current token id
  const tokenId = typeof window.app.config.sessionToken.id === 'string'
    ? window.app.config.sessionToken.id
    : false;

  // Send the current token to the tokens endpoint to delete it
  const queryStringObject = {
    id: tokenId
  };

  window.app.client.request({
    path: 'api/tokens',
    method: 'DELETE',
    queryStringObject,
    callback: (statusCode, responsePayload) => {
      // Set the app.config token as false
      window.app.setSessionToken(false);

      // Send the user to the logged out page
      window.location = '/';

    },
  });
};

// Bind the logout button
window.app.bindLogoutButton = function () {
  const node = document.getElementById('logoutButton');
  if (node) {
    node.addEventListener('click', e => {
      e.preventDefault();
      window.app.logUserOut();
    });
  }
};
