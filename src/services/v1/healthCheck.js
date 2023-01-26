/* eslint-disable class-methods-use-this */

const logger = require('../../logging/createLogger')(__filename);
const { stringify, objError } = require('../../logging/format/common');
const {
  TYPE_INFO, TYPE_WARN, TYPE_ERROR, MESSAGE
} = require('../../../config/constants');
const { random } = require('../../../utils/string');

class HealthCheck {
  constructor(manifest) {
    Object.assign(this, manifest)
  }

  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  caller() {
    // * This is fake error for getting where the method call from;
    // * in case, we can't use arguments.caller in strict mode
    const e = new Error();
    return e.stack.split('\n')[3].trim().split(/\s/g)[1]
  }

  logInfo(result) {
    logger.info(stringify(
      `${TYPE_INFO.SERVICE_V1}: ${this.caller()}`,
      ({
        returned: result
      })
    ));
  }

  logError(err) {
    logger.error(stringify(
      `${TYPE_ERROR.SERVICE_V1}: ${this.caller()}`,
      objError(err)
    ));
  }

  async checkRedis() {
    if (!this.redis) return null;

    try {
      const testKey = `${this.config.app.packageName}::HealthCheck`
      const testVal = random(10);
      await this.redis.set(testKey, testVal)
      const result = await this.redis.get(testKey)

      return { name: 'redis', status: 'up', notes: `${testKey} => ${testVal}` }
    } catch (e) {
      this.logError(e)
      return { name: 'redis', status: 'down', notes: e.message }
    }
  }

  async checkSQL() {
    if (!this.sql) return null;

    try {
      const result = await this.sql.sequelize.getDatetime()

      return { name: 'sql', status: 'up', notes: `getDatetime() => ${result}` }
    } catch (e) {
      this.logError(e)
      return { name: 'sql', status: 'down', notes: e.message }
    }
  }

  async checkMongoDB() {
    if (!this.mongo) return null;
    const connections = {};

    try {
      Object.entries(this.mongo.mongoose.connections).forEach(([i, con]) => {
        connections[i] = {
          code: con._readyState,
          state: con.states[con._readyState]
        }
      })

      if (Object.values(connections).map(con => con.code).indexOf(1) === -1) {
        throw new Error('No one connected')
      }

      return { name: 'mongo', status: 'up', notes: connections }
    } catch (e) {
      this.logError(e)
      return { name: 'mongo', status: 'down', notes: connections }
    }
  }

  async checkAll() {
    const result = [];
    const redis = await this.checkRedis();
    if (redis) result.push(redis)

    const sql = await this.checkSQL();
    if (sql) result.push(sql)

    const mongodb = await this.checkMongoDB();
    if (mongodb) result.push(mongodb)

    this.logInfo(result)
    return result;
  }
}

module.exports = HealthCheck;
