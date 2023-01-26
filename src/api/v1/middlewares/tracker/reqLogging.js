const morgan = require('morgan');

const { TYPE_INFO } = require('../../../../../config/constants');
const logger = require('../../../../logging/createLogger')(__filename);
const { httpLogMinimal, httpLog } = require('../../../../logging/format/common');

const morganConfig = {
  stream: {
    write: (text) => {
      let message = text.trim();
      try {
        message = JSON.parse(message);
        if (message.url) {
          message.url = decodeURIComponent(message.url)
        }
        message = JSON.stringify(message)
      } catch (e) {
        // * Just nothing to do
      }
      logger.info(`{"type":"${TYPE_INFO.REST_API}","message":${message}}`)
    }
  }
};

module.exports = {
  httpLogMinimal: morgan(httpLogMinimal, { ...morganConfig, immediate: true }),
  httpLog: morgan(httpLog, { ...morganConfig, immediate: false })
};
