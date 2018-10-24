/*
 * Frontend Logic for application
 *
 */


console.log('------------ App client side initialized ---------');

window.app = {
  config: {
    sessionToken: false
  },
};

window.onload = function () {

  window.app.bindForms();
  window.app.bindLogoutButton();
  window.app.getSessionToken();

};

