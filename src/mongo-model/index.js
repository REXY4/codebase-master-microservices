const _ = require('lodash')
const Mongoose = require('mongoose')
const logger = require('../logging/createLogger')(__filename);
const { stringify, objError } = require('../logging/format/common');
const {
  TYPE_INFO,
  TYPE_WARN,
  TYPE_ERROR,
  MESSAGE
} = require('../../config/constants');

const register = async (opts) => {
  const {
    host,
    port,
    username: user,
    password: pass,
    database: dbName,
    family,
    autoIndex,
    pool,
    logConnection
  } = opts

  try {
    const options = {
      user,
      pass,
      dbName,
      family,
      autoIndex,
      ...pool
    }
    const mongoose = await Mongoose.connect(`mongodb://${host}:${port}`, options)

    if ([undefined, true].indexOf(logConnection) > -1) {
      Mongoose.connection.on('connecting', (...args) => logger.debug(stringify(TYPE_INFO.MONGODB, MESSAGE.MONGODB_POOL_CONNECTING)))
      Mongoose.connection.on('connected', (...args) => logger.info(stringify(TYPE_INFO.MONGODB, MESSAGE.MONGODB_POOL_CONNECTED)))
      Mongoose.connection.on('disconnecting', (...args) => logger.warn(stringify(TYPE_WARN.MONGODB, MESSAGE.MONGODB_POOL_DISCONNECTING)))
      Mongoose.connection.on('disconnected', (...args) => logger.error(stringify(TYPE_ERROR.MONGODB, MESSAGE.MONGODB_POOL_DISCONNECTED)))
      Mongoose.connection.on('close', (...args) => logger.error(stringify(TYPE_ERROR.MONGODB, MESSAGE.MONGODB_POOL_CLOSED)))
      Mongoose.connection.on('reconnected', (...args) => logger.debug(stringify(TYPE_INFO.MONGODB, MESSAGE.MONGODB_POOL_RECONNECTED)))
      Mongoose.connection.on('reconnectFailed', (...args) => logger.error(stringify(TYPE_ERROR.MONGODB, MESSAGE.MONGODB_POOL_RECONNECT_FAIL)))
      Mongoose.connection.on('error', (...args) => logger.error(stringify(TYPE_ERROR.MONGODB, MESSAGE.MONGODB_POOL_ERROR)))
      Mongoose.connection.on('fullsetup', (...args) => logger.info(stringify(TYPE_INFO.MONGODB, MESSAGE.MONGODB_POOL_FULLSETUP)))
      Mongoose.connection.on('all', (...args) => logger.info(stringify(TYPE_INFO.MONGODB, MESSAGE.MONGODB_POOL_ALL_CONNECTED)))
    }

    logger.info(stringify(TYPE_INFO.MONGODB, MESSAGE.MONGODB_CONNECTED))

    return {
      model: require('./init-models')(mongoose),
      mongoose
    }
  } catch (err) {
    logger.error(stringify(TYPE_ERROR.MONGODB, objError(err)));
    if (err.parent) {
      if (err.parent.message !== err.message) {
        logger.error(stringify(TYPE_ERROR.MONGODB, objError(err.parent)))
      }
    }
    if (err.original) {
      if (err.parent) {
        if (err.original.message !== err.parent.message) {
          logger.error(stringify(TYPE_ERROR.MONGODB, objError(err.original)))
        }
      }
    }

    await Mongoose.connection.close();

    return null;
  }
}

module.exports = register
