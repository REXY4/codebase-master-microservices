const { faker } = require('@faker-js/faker');
const amqplib = require('amqplib');
const _ = require('lodash');
const logger = require('../logging/createLogger')(__filename);
const { stringify } = require('../logging/format/common');
const {
  TYPE_INFO,
  TYPE_WARN,
  TYPE_ERROR,
  MESSAGE
} = require('../../config/constants');

module.exports = class Client {
  Channels = {};

  // eslint-disable-next-line object-curly-newline
  constructor({ user, password, host, port } = {}, options = {}) {
    this.host = host || 'localhost';
    this.port = port || 5672;

    this.setOpts({
      /**
       * * frameMax
       * the size in bytes of the maximum frame allowed over the connection.
       * 0 means no limit (but since frames have a size field which is an unsigned 32 bit integer, it’s perforce 2^32 - 1);
       * default it to 0x1000, i.e. 4kb, which is the allowed minimum, will fit many purposes, and not chug through Node.JS’s buffer pooling.
       */
      frameMax: 0,
      /**
       * * channelMax
       * the maximum number of channels allowed.
       * default is 0, meaning 2^16 - 1.
       */
      channelMax: 0,
      /**
       * * heartbeat
       * the period of the connection heartbeat, in seconds.
       * defaults to 0; see heartbeating
       */
      heartbeat: 15,
      /**
       * * locale
       * the desired locale for error messages, I suppose.
       * RabbitMQ only ever uses en_US; which, happily, is the default
       */
      locale: 'en_US',
      ..._.pickBy(options, _.identity)
    })

    this.setExchangeOpts({
      /**
       * * durable (boolean)
       * if true, the exchange will survive broker restarts.
       * defaults to true.
       */
      durable: true,
      /**
       * * internal (boolean)
       * if true, messages cannot be published directly to the exchange
       * i.e., it can only be the target of bindings, or possibly create messages ex-nihilo.
       * defaults to false.
       */
      internal: false,
      /**
       * * autoDelete (boolean)
       * if true, the exchange will be destroyed once the number of bindings for which it is the source drop to zero.
       * defaults to false.
       */
      autoDelete: false,
      /**
       * * alternateExchange (string)
       * an exchange to send messages to if this exchange can’t route them to any queues
       */
      alternateExchange: undefined,
    })

    const params = new URLSearchParams(this.options)
    this.params = params.toString() ? `?${params.toString()}` : '';

    const acl = user && password ? `${user}:${password}@` : '';
    this.url = `amqp://${acl}${this.host}:${this.port}${this.params}`;
  }

  setOpts(options) {
    this.options = {
      ...this.options,
      ...options
    }

    return this.options
  }

  setExchangeOpts(options) {
    this.exchangeOptions = {
      ...this.exchangeOptions,
      ...options
    }

    return this.exchangeOptions
  }

  async connect(reconnect = true) {
    if (this.status) return this.Connection;

    logger.debug(stringify(TYPE_INFO.RABBIT_MQ, MESSAGE.RABBITMQ_CONNECTION_CREATION));
    this.Connection = await amqplib.connect(this.url);

    // Events listener
    // this.Connection.on('frameError', (err) => console.error('connection:frameError', err));
    // this.Connection.on('blocked', (...args) => console.debug('connection:blocked', ...args))
    // this.Connection.on('unblocked', (...args) => console.debug('connection:unblocked', ...args))
    this.Connection.on('error', (err) => {
      const msg = err ? ` : ${err.message}` : ''
      logger.error(
        stringify(
          TYPE_ERROR.RABBIT_MQ,
          `${MESSAGE.RABBITMQ_CONNECTION_ERROR}${msg}`
        )
      )
    });
    this.Connection.on('close', async (err) => {
      const msg = err ? ` : ${err.message}` : ''
      logger.warn(
        stringify(
          TYPE_WARN.RABBIT_MQ,
          `${MESSAGE.RABBITMQ_CONNECTION_CLOSED}${msg}`
        )
      )

      this.status = false;
      if (reconnect && err !== undefined) await this.connect();
    });

    const url = `amqp://${this.host}:${this.port}${this.params}`
    logger.info(stringify(
      TYPE_INFO.RABBIT_MQ,
      `${MESSAGE.RABBITMQ_CONNECTION_ESTABLISH} at ${url}`
    ));

    this.status = true;
    return this.Connection;
  }

  async #channel(id, reconnect, isConfirmation) {
    logger.debug(stringify(
      TYPE_INFO.RABBIT_MQ,
      `${MESSAGE.RABBITMQ_CHANNEL_CREATION} (${id})`
    ));

    const conn = await this.connect();
    const channel = isConfirmation ? await conn.createConfirmChannel() : await conn.createChannel();

    this.Channels[id] = { status: false }

    // channel.on('drain', (...args) => console.debug(`channel(${id}):drain`, ...args))
    // channel.on('ack', (...args) => console.debug(`channel(${id}):ack`, ...args))
    // channel.on('nack', (...args) => console.warn(`channel(${id}):nack`, ...args))
    // channel.on('cancel', (...args) => console.debug(`channel(${id}):cancel`, ...args))
    // channel.on('delivery', (...args) => console.debug(`channel(${id}):delivery`, ...args))
    // * Use this for handling no queue binding to routing key
    channel.on('return', (...args) => console.error(`channel(${id}):return`, ...args))
    channel.on('error', (err) => {
      const msg = err ? ` : ${err.message}` : ''
      logger.error(
        stringify(
          TYPE_ERROR.RABBIT_MQ,
          `${MESSAGE.RABBITMQ_CHANNEL_ERROR} (${id})${msg}`
        )
      )
    })
    channel.on('close', (err) => {
      const msg = err ? ` : ${err.message}` : ''
      logger.warn(
        stringify(
          TYPE_WARN.RABBIT_MQ,
          `${MESSAGE.RABBITMQ_CHANNEL_CLOSED} (${id})${msg}`
        )
      )

      this.Channels[id].status = false
      if (reconnect && err !== undefined) this.#channel(id, reconnect)
    })

    logger.info(stringify(
      TYPE_INFO.RABBIT_MQ,
      `${MESSAGE.RABBITMQ_CHANNEL_ESTABLISH} (${id})`
    ));

    channel._id = id;
    this.Channels[id].status = true
    this.Channels[id].channel = channel;
    return channel
  }

  async channel(id, reconnect = true) {
    const chId = id || `ch:${faker.word.adjective()}`;
    if (this.Channels[chId]) {
      if (this.Channels[chId].status) {
        return this.Channels[chId].channel;
      }
    }

    return this.#channel(chId, reconnect, false);
  }

  async confirmChannel(id, reconnect = true) {
    const chId = id || `ch:${faker.word.adjective()}`;
    if (this.Channels[chId]) {
      if (this.Channels[chId].status) {
        return this.Channels[chId].channel;
      }
    }

    return this.#channel(chId, reconnect, true);
  }

  async exchange({ name, type, options }, _channel = '') {
    if (!(name && type)) throw new Error('Exchange name and type cannot be empty');

    const exchangeOpts = this.setExchangeOpts(_.pickBy(options, _.identity))
    const channel = (typeof _channel === 'string') ? await this.channel(_channel) : _channel;
    const assertExchange = await channel.assertExchange(name, type, exchangeOpts);

    if (!assertExchange) throw new Error('Failed asserting exchange')

    return {
      exchange: assertExchange.exchange,
      channel
    }
  }
}
