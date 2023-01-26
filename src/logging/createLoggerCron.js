const path = require('path');
const { createLogger } = require('./logger');
const { logLevel } = require('../../config/app');
const correlationId = require('./correlationIdCron');

const logger = (fileName) => createLogger({
  level: (logLevel === ('development' || 'debug')) ? 'debug' : 'info',
  getId: correlationId.getId,
  caller: path.basename(fileName)
});

module.exports = logger;
