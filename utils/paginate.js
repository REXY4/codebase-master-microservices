/**
 * Format value to integer, set default value if fail
 * @param {string} value
 * @param {string} defaultValue
 * @returns {Number}
 */
const toNumber = (value, defaultValue) => (parseInt(value, 10) || defaultValue);

/**
 * Format paging for query
 * @param {string} page - target page
 * @param {string} pageSize - number of record in each page
 * @returns {object} - paginate
 */
const paginate = ({ page, pageSize }) => {
  const limit = toNumber(pageSize, 0);
  const offset = limit * Math.max(0, (toNumber(page, 0) - 1));
  if (limit === 0) {
    return undefined;
  }

  return { limit, offset };
};

module.exports = paginate;
