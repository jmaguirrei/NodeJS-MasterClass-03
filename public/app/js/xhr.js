
// Interface for making API calls
window.app.client = {};

// Interface for making API calls
window.app.client.request = function (args) {

  const {
    headers = {},
    path = '/',
    method = 'GET',
    queryStringObject = {},
    payload = {},
    callback = false,
  } = args;

  const methodUCase = method.toUpperCase();

  console.log('client.request', {
    headers,
    path,
    method: methodUCase,
    queryStringObject,
    payload,
    callback,
  });

  // For each query string parameter sent, add it to the path
  let requestUrl = path + '?';
  let counter = 0;
  for (let queryKey in queryStringObject) {
    if (queryStringObject.hasOwnProperty(queryKey)) {
      counter++;
      // If at least one query string parameter has already been added, preprend new ones with an ampersand
      if (counter > 1) requestUrl += '&';
      // Add the key and value
      requestUrl += queryKey + '=' + queryStringObject[queryKey];
    }
  }

  // Form the http request as a JSON type
  const xhr = new window.XMLHttpRequest();
  xhr.open(methodUCase, requestUrl, true);
  // xhr.open(method, requestUrl, true);
  xhr.setRequestHeader('Content-type', 'application/json');

  // For each header sent, add it to the request
  for (let headerKey in headers) {
    if (headers.hasOwnProperty(headerKey)) {
      xhr.setRequestHeader(headerKey, headers[headerKey]);
    }
  }

  // If there is a current session token set, add that as a header
  if (window.app.config.sessionToken) {
    xhr.setRequestHeader('token', window.app.config.sessionToken.id);
  }

  // When the request comes back, handle the response
  xhr.onreadystatechange = function () {
    if (xhr.readyState === window.XMLHttpRequest.DONE) {
      const statusCode = xhr.status;
      const responseReturned = xhr.responseText;

      // Callback if requested
      if (callback) {
        try {
          const parsedResponse = JSON.parse(responseReturned);
          callback(statusCode, parsedResponse);
        } catch(e) {
          callback(statusCode, false);
        }

      }
    }
  };

  // Send the payload as JSON
  const payloadString = JSON.stringify(payload);
  xhr.send(payloadString);

};
