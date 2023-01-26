const _ = require('lodash');
const logger = require('../logging/createLogger')(__filename);
const { stringify } = require('../logging/format/common');
const { TYPE_INFO, MESSAGE } = require('../../config/constants');

module.exports = class Publisher {
  constructor(client, exchange, channel) {
    this.exchange = exchange;
    this.channel = channel;
    this.client = client;

    this.setOpts({
      /**
       * * persistence
       * if truthy, the message will survive broker restarts provided it’s in a queue that also survives restarts.
       */
      persistence: true,
      /**
       * * mandatory
       * if true, the message will be returned if it is not routed to a queue
       * i.e., if there are no bindings that match its routing key.
       */
      mandatory: true
    });
  }

  setOpts(options) {
    this.options = {
      ...this.options,
      ...options
    }

    return this.options
  }

  async #prepare(message, options) {
    const opts = {
      ...this.options,
      ..._.pickBy(options, _.identity)
    };

    if (!this.Channel) {
      const { exchange, channel } = await this.client.exchange(this.exchange, this.channel)
      this.Channel = channel
      this.Exchange = exchange
    }

    const data = Buffer.isBuffer(message)
      ? message
      : Buffer.from(typeof message === 'object' ? JSON.stringify(message) : message);

    return { data, opts }
  }

  // * callback are usefull while you are using confirmChannel
  async sendToQueue(queue, message, options, callback) {
    const { data, opts } = await this.#prepare(message, options)
    logger.info(
      stringify(
        TYPE_INFO.RABBIT_MQ,
        `${MESSAGE.RABBITMQ_PUBLISH} (${this.Channel._id})`,
        { options, message }
      )
    )

    /**
     * Channels act like stream.Writable when you call publish or sendToQueue: they return either true, meaning “keep sending”,
     * or false, meaning “please wait for a ‘drain’ event”.
     * Those methods, along with ack, ackAll, nack, nackAll, and reject, do not have responses from the server.
     * This means they do not return a promise in the promises API. The ConfirmChannel does accept a callback in both APIs,
     * called when the server confirms the message; as well as returning a boolean.
     */
    return this.Channel.sendToQueue(queue, data, opts, callback)
  }

  // * callback are usefull while you are using confirmChannel
  async publish(route, message, options, callback) {
    const { data, opts } = await this.#prepare(message, options)
    logger.info(
      stringify(
        TYPE_INFO.RABBIT_MQ,
        `${MESSAGE.RABBITMQ_PUBLISH} (${this.Channel._id})`,
        { options, message }
      )
    )
    /**
     * Channels act like stream.Writable when you call publish or sendToQueue: they return either true, meaning “keep sending”,
     * or false, meaning “please wait for a ‘drain’ event”.
     * Those methods, along with ack, ackAll, nack, nackAll, and reject, do not have responses from the server.
     * This means they do not return a promise in the promises API. The ConfirmChannel does accept a callback in both APIs,
     * called when the server confirms the message; as well as returning a boolean.
     */
    return this.Channel.publish(this.Exchange, route, data, opts, callback)
  }
}
