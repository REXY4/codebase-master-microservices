const { TYPE_INFO, TYPE_WARN } = require('../../../../config/constants');
const logger = require('../../../logging/createLoggerGrpc')(__filename);
const { stringify, objError } = require('../../../logging/format/common');

module.exports = async (ctx, next) => {
  // FIXME: Make sure process auth middleware before next() by validate ctx.metadata

  // * Delete this logger.warn if you already implement auth processing
  logger.warn(JSON.stringify({
    type: TYPE_WARN.GRPC,
    message: 'Auth middleware is must!',
    fullname: ctx.fullName,
    metadata: ctx.metadata
  }, 0, 2))

  await next();
};
