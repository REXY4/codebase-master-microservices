/* eslint-disable no-undef, no-cond-assign */

/**
 * Format autonumber with fixed length
 * @param {String} number - autonumber
 * @param {String} length - fixed length of autonumber
 * @returns {String} - padded autonumber
 */
const padNumber = (number, length) => {
  let s = number.toString();
  while (s.length < (length || 6)) {
    s = `0${s}`;
  }

  return s;
};

/**
 * @param {String} string - prefix string
 * @param {String} number - auto number (this has to be String)
 * @param {Number} length - auto number fixed length (defaults to 6)
 */
const generateCode = (string, number, length = 6) => {
  if (!string || !string.length > 0 || !number || !number.length > 0) {
    return undefined;
  }

  const str = string.toString();
  return str + padNumber(number, length);
};

function format(pattern, values) {
  const re = /\{\w+\}/g

  let result = pattern.substr(0)
  if (values) {
    while ((matches = re.exec(pattern)) != null) {
      const key = matches[0].replace(/\{|\}/g, '')
      result = result.replace(matches[0], values[key] || matches[0])
    }
  }

  return result
}

const random = (length = 3) => {
  const result = [];
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join('');
};

module.exports = {
  generateCode,
  padNumber,
  format,
  random
};
