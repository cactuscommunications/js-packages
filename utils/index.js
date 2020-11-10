/**
 * Loops through a query parameters and encodes it.
 * @param {object} params
 */
const encodeURIQuery = (params) => {
  const ret = [];
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      ret.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    }
  });
  return ret.join("&");
};

/**
 * Encodes the string
 * @param {string} value
 */
const base64encodeURIComponent = (value) => {
  let data = btoa(value);
  const mapObj = {
    "+": "-",
    "/": "_",
  };
  data = data.replace(/=+$/, ""); // removes trailing =
  data = data.replace(/\+|\//gi, (matched) => {
    // removes witin the string
    return mapObj[matched];
  });

  return data;
};
/**
 * Generates random number with specified length
 * @param {number} length
 */
const random = (length) => {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export { encodeURIQuery, base64encodeURIComponent, random };
