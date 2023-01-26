const winston = require('winston');

function createLogger(opts = {}) {
  const {
    level = 'info',
    getId,
    defaultValue = 'nocorrelation',
    caller = ''
  } = opts;

  return winston.createLogger({
    format: winston.format.combine(
      winston.format((info) => {
        const data = info;
        data.correlationId = getId() || defaultValue;
        data.caller = caller;
        return info;
      })(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      // winston.format.colorize(),
      winston.format.printf(({
        timestamp,
        correlationId,
        // eslint-disable-next-line no-shadow
        level,
        message
      }) => `${timestamp} ${caller} (${correlationId}) ${level} : ${message}`)
      // }) =>  `${message ? JSON.stringify(message, null, 4) : ''}`)
    ),
    level,
    transports: [
      new winston.transports.Console({
        handleExceptions: false
      })
    ],
    exitOnError: false
  });
}

module.exports = { createLogger };
