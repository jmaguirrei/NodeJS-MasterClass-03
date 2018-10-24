

module.exports = function createRandomString(strLength) {

  const validStrLength = typeof strLength === 'number' && strLength > 0 ? strLength : false;
  if (!validStrLength) return false;

  // Define all the possible characters that could go into a string
  const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

  // Start the final string
  let str = '';
  for(let i = 1; i <= strLength; i++) {
    // Get a random charactert from the possibleCharacters string
    const position = Math.floor(Math.random() * possibleCharacters.length);
    const randomCharacter = possibleCharacters.charAt(position);
    // Append this character to the string
    str += randomCharacter;
  }
  // Return the final string
  return str;

};

