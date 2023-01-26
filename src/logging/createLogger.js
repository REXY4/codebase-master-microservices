const path = require('path');

const correlationId = require('./correlationId');
const { createLogger } = require('./logger');
const { NODE_ENV } = require('../../config');

const logger = (fileName) => createLogger({
  level: (NODE_ENV === ('development' || 'debug')) ? 'debug' : 'info',
  getId: correlationId.getId,
  caller: path.basename(fileName)
});

module.exports = logger;
