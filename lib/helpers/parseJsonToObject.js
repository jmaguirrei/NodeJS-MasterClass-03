

module.exports = function parseJsonToObject(str) {

  // Parse a JSON string to an object in all cases, without throwing
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch(e) {
    return {};
  }

};

