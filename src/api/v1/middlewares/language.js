const { langs } = require('../../../../config/message');

module.exports = async (req, res, next) => {
  const using = (req.query.lang || 'en').toLowerCase();
  req.language = langs.indexOf(using) > -1 ? using : 'en';

  return next();
};
