const _ = require('lodash')
const { Op, Sequelize } = require('sequelize')
const logger = require('../logging/createLogger')(__filename);
const { stringify, objError } = require('../logging/format/common');
const {
  TYPE_INFO,
  TYPE_ERROR,
  MESSAGE
} = require('../../config/constants');

const register = async (opts) => {
  const { logConnection } = opts
  const sequelize = new Sequelize(opts)
  const fixOperator = (condition) => {
    const data = _.cloneDeep(condition)
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof Object) data[key] = fixOperator(value)

      if (key.indexOf('$') === 0) {
        data[Op[key.substr(1)]] = _.cloneDeep(value)
        delete data[key]
      }
    })
    return data
  }

  if ([undefined, true].indexOf(logConnection) > -1) {
    sequelize.beforeConnect((...args) => logger.debug(stringify(TYPE_INFO.SQL, MESSAGE.SQL_POOL_CONNECTING)))
    sequelize.afterConnect((...args) => logger.debug(stringify(TYPE_INFO.SQL, MESSAGE.SQL_POOL_CONNECTED)))
    sequelize.beforeDisconnect((...args) => logger.debug(stringify(TYPE_INFO.SQL, MESSAGE.SQL_POOL_RELEASING)))
    sequelize.afterDisconnect((...args) => logger.debug(stringify(TYPE_INFO.SQL, MESSAGE.SQL_POOL_RELEASED)))
  }

  try {
    await sequelize.authenticate()
    logger.info(stringify(TYPE_INFO.SQL, MESSAGE.SQL_CONNECTED))

    sequelize.getDatetime = async (options) => {
      const data = await sequelize.query(
        opts.query.dateTime,
        { ...options, raw: true, type: Sequelize.QueryTypes.SELECT }
      )
      return Object.values(data[0])[0]
    }
    sequelize.constructOptions = (options = {}, multiple = true) => {
      options = options || {}
      if (multiple) {
        options.limit = options.limit || 10
        options.offset = options.offset || 0

        if (options.limit === -1) delete options.limit;
      }

      if (options.where) options.where = fixOperator(options.where)
      if (options.include) {
        if (options.attributes) {
          const attributes = []
          Object.keys(options.attributes).forEach(idx => {
            const key = options.attributes[idx]
            const keys = key.split('.')
            if (keys.length > 1) {
              const field = keys[keys.length - 1]

              keys.pop()

              const alias = keys.join('.')
              const inner = options.include.filter(el => el.as === alias)[0]
              if (inner) {
                inner.attributes = inner.attributes || []
                inner.attributes.push(field)
              } else {
                attributes.push(key)
              }
            } else {
              attributes.push(key)
            }
          })
          delete options.attributes
          if (attributes.length) options.attributes = attributes
        }

        Object.keys(options.where).forEach(key => {
          const keys = key.split('.')
          if (keys.length > 1) {
            const field = keys[keys.length - 1]

            keys.pop()

            const alias = keys.join('.')
            const inner = options.include.filter(el => el.as === alias)[0]
            if (inner) {
              inner.where = inner.where || {}
              inner.where[field] = options.where[key]
              inner.where.deletedAt = { [Op.is]: null }
            }

            delete options.where[key]
          }
        })
      }

      return options
    }

    return {
      model: require('./init-models')(sequelize),
      sequelize
    }
  } catch (err) {
    logger.error(stringify(TYPE_ERROR.SQL, objError(err)));
    if (err.parent) {
      if (err.parent.message !== err.message) {
        logger.error(stringify(TYPE_ERROR.SQL, objError(err.parent)))
      }
    }
    if (err.original) {
      if (err.parent) {
        if (err.original.message !== err.parent.message) {
          logger.error(stringify(TYPE_ERROR.SQL, objError(err.original)))
        }
      }
    }

    await sequelize.close();

    return null;
  }
}

module.exports = register
