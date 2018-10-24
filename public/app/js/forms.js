
// Local helpers
const $ = id => document.getElementById(id);
const getErrorNode = formId => document.querySelector(`#${formId} .formError`);
const getErrorMessage = (response = {}) => {
  const errorMessage = 'An error has occured, please try again';
  return response.Error || errorMessage;
};

// formProcessor
window.app.formProcessor = function ({ payload, formId }) {

  const errorNode = getErrorNode(formId);
  const formNode = $(formId);

  if (formId === 'accountCreate' || formId === 'accountLogin') {

    // Fire the request
    window.app.client.request({
      path: formNode.action,
      method: formNode.method.toUpperCase(),
      payload,
      callback: (statusCode, responsePayload) => {

        if (statusCode !== 200) {

          if (statusCode === 403) {
            // log the user out
            window.app.logUserOut();
          } else {
            // Set the formError field with the error text
            errorNode.innerHTML = getErrorMessage(responsePayload);
            errorNode.style.display = 'block';
          }
        } else if (formId === 'accountCreate') {

          // If successful, send to form response processor
          const newPayload = {
            email: payload.email,
          };

          window.app.client.request({
            path: 'api/tokens',
            method: 'POST',
            payload: newPayload,
            callback: (newStatusCode, newResponsePayload) => {
              if (newStatusCode !== 200) {
                // Set the formError field with the error text
                errorNode.innerHTML = getErrorMessage(newResponsePayload);
                errorNode.style.display = 'block';
              } else {
                // If successful, set the token and redirect the user
                window.app.setSessionToken(newResponsePayload);
                window.location = '/menu';
              }
            },
          });

        } else {

          // If login was successful, set the token in localstorage and redirect the user
          window.app.setSessionToken(responsePayload);
          window.location = '/menu';
        }
      },
    });


  }

  // Place the order to the api
  if (formId === 'menuItems') {
    const tokenObject = JSON.parse(window.localStorage.getItem('token'));
    window.app.client.request({
      path: 'api/order',
      method: 'POST',
      payload: {
        email: tokenObject.email,
        order: payload,
      },
      callback: (newStatusCode, newResponsePayload) => {
        if (newStatusCode !== 200) {
          // console.log(newStatusCode);
          window.location = `/error?desc=${newResponsePayload.Error}`;
        } else {
          // If successful
          const { orderId } = newResponsePayload;
          window.location = `/order/cart?orderId=${orderId}`;
        }
      },
    });
  }

  // Make the payment and sed the email
  if (formId === 'orderCart') {
    const params = (new window.URL(document.location)).searchParams;
    const orderId = params.get('orderId');
    window.app.client.request({
      path: 'api/payment',
      method: 'POST',
      payload: {
        orderId,
      },
      callback: (newStatusCode, newResponsePayload) => {
        if (newStatusCode !== 200) {
          window.location = `/error?desc=${newResponsePayload.Error}`;
        } else {
          // If successful, set the token and redirect the user
          window.location = '/order/success';
        }
      },
    });
  }

};


// Bind the forms
window.app.bindForms = function () {

  [ 'accountCreate', 'accountLogin', 'menuItems', 'orderCart' ].forEach(formId => {

    const formNode = $(formId);
    if (formNode) {

      formNode.addEventListener('submit', e => {

        // Get form payload
        e.preventDefault();
        const elements = [ ...formNode.elements ];
        const payload = elements.reduce((acum, node) => {
          if (node.type === 'submit') return acum;
          const value = node.type === 'checkbox' ? node.checked : node.value;
          return {
            [node.name]: value,
            ...acum,
          };
        }, {});

        window.app.formProcessor({ formId, payload });

      });
    }
  });


};

