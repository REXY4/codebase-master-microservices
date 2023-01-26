/* eslint-disable class-methods-use-this */

const logger = require('../../logging/createLogger')(__filename);
const { stringify, objError } = require('../../logging/format/common');
const { TYPE_INFO, TYPE_ERROR } = require('../../../config/constants');
const { Publisher } = require('../../rabbitmq');

class Enumeration {
  constructor(manifest) {
    Object.assign(this, manifest)
  }

  caller() {
    // * This is fake error for getting where the method call from;
    // * in case, we can't use arguments.caller in strict mode
    const e = new Error();
    return e.stack.split('\n')[3].trim().split(/\s/g)[1]
  }

  logInfo(options, result) {
    logger.info(stringify(
      `${TYPE_INFO.SERVICE_V1}: ${this.caller()}`,
      ({
        returned: result.rows ? result.rows.length : result.length,
        options
      })
    ));
  }

  logError(err) {
    logger.error(stringify(
      `${TYPE_ERROR.SERVICE_V1}: ${this.caller()}`,
      objError(err)
    ));
  }

  async #publish(message) {
    const { Enum } = this.config.rabbitmq.queue;
    const publisher = new Publisher(this.rmq, Enum.exchange, this.rmq.channel)
    publisher.setOpts({ persistence: false, mandatory: true })
    publisher.publish(Enum.route, message, null, (err) => {
      if (err) this.logError(err)
    })
  }

  async create(data, options, writer) {
    const { repo } = this.sql;
    const result = await repo.enumeration.create(data, options, writer);
    this.logInfo({ data, options, writer }, result)
    this.#publish({ msg: 'create' })
    return result;
  }

  async getBy(options) {
    const { repo } = this.sql;
    const result = await repo.enumeration.getBy(options);
    this.logInfo({ options }, result)
    return result;
  }

  async deleteBy(options, writer) {
    const { repo } = this.sql;
    const result = await repo.enumeration.deleteBy(options, writer);
    this.logInfo({ options, writer }, result)
    if (result.count) this.#publish({ msg: 'delete' })
    return result;
  }

  async updateBy(data, options, writer) {
    const { repo } = this.sql;
    const result = await repo.enumeration.updateBy(data, options, writer);
    this.logInfo({ data, options, writer }, result)
    if (result.count) this.#publish({ msg: 'update' })
    return result;
  }
}

module.exports = Enumeration
