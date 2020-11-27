/**
 *Utility function to convert project name into camelCase
 *
 * @param {string} inputString
 * @return {string}
 */
function toCamelCase(inputString) {
  const inputArray = inputString.match(
    /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g,
  );
  let result = '';

  for (let i = 0, len = inputArray.length; i < len; i += 1) {
    const currentStr = inputArray[i];

    let tempStr = currentStr.toLowerCase();

    if (i !== 0) {
      // convert first letter to upper case (the word is in lowercase)
      tempStr = tempStr.substr(0, 1).toUpperCase() + tempStr.substr(1);
    }

    result += tempStr;
  }

  return result;
}

module.exports = toCamelCase;
