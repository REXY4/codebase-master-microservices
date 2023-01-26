const _ = require('lodash');
const { ReasonPhrases, StatusCodes } = require('http-status-codes')

const { TYPE_ERROR } = require('../../../../config/constants');
const logger = require('../../../logging/createLogger')(__filename);
const { stringify, objError } = require('../../../logging/format/common');

const errorCodeFinder = (err) => {
  const anEmpty = [undefined, null, 0, ''];
  return _.without([err.code, err.no, err.errno], ...anEmpty).join(' ') || 'NULL'
}

/* Catch any exceptions / error */
module.exports = function (err, _req, res, next) {
  logger.error(stringify(TYPE_ERROR.UNCAUGHT, objError(err)));
  if (err.parent) {
    if (err.parent.message !== err.message) {
      logger.error(stringify(TYPE_ERROR.UNCAUGHT, objError(err.parent)))
    }
  }
  if (err.original) {
    if (err.parent) {
      if (err.original.message !== err.parent.message) {
        logger.error(stringify(TYPE_ERROR.UNCAUGHT, objError(err.original)))
      }
    }
  }

  // * Build stacked error messages
  const messages = [
    { code: errorCodeFinder(err), message: err.message }
  ];
  if (err.parent) {
    if (err.parent.message !== err.message) {
      messages.push({ code: errorCodeFinder(err.parent), message: err.parent.message });
    }
  }
  if (err.original) {
    if (err.parent) {
      if (err.original.message !== err.parent.message) {
        messages.push({ code: errorCodeFinder(err.original), message: err.original.message });
      }
    }
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    status: ReasonPhrases.INTERNAL_SERVER_ERROR,
    messages
  })
};
