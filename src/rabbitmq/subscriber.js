const os = require('os');
const _ = require('lodash');
const { faker } = require('@faker-js/faker');
const logger = require('../logging/createLogger')(__filename);
const { stringify } = require('../logging/format/common');
const { TYPE_INFO, TYPE_WARN, MESSAGE } = require('../../config/constants');

module.exports = class Subscriber {
  constructor(client, exchange, channel) {
    this.exchange = exchange;
    this.channel = channel;
    this.client = client;

    this.setOpts({
      prefetch: 1, // receive message freq (count) per interval
      allUpTo: false, // stop consuming while fail
      requeue: true, // move to queue again while fail
      stopAt: -1 // stop consuming at interval
    })

    this.setQueueOpts({
      /**
       * * exclusive
       * if true, scopes the queue to the connection
       * defaults to false
       */
      exclusive: false,
      /**
       * * durable
       * if true, the queue will survive broker restarts, modulo the effects of exclusive and autoDelete;
       * defaults to true if not supplied, unlike the others
       */
      durable: true,
      /**
       * * autoDelete
       * if true, the queue will be deleted when the number of consumers drops to zero
       * defaults to false.
       */
      autoDelete: false
    })

    this.setConsumeOpts({
      /**
       * * consumerTag
       * a name which the server will use to distinguish message deliveries for the consumer mustn’t be already in use on the channel.
       * it’s usually easier to omit this, in which case the server will create a random name and supply it in the reply.
       */
      consumerTag: this.tag,
      /**
       * * noLocal
       * in theory, if true then the broker won’t deliver messages to the consumer if they were also published on this connection;
       * RabbitMQ doesn’t implement it though, and will ignore it.
       * defaults to false.
       */
      noLocal: false,
      /**
       * * noAck
       * if true, the broker won’t expect an acknowledgement of messages delivered to this consumer;
       * i.e., it will dequeue messages as soon as they’ve been sent down the wire.
       * defaults to false (i.e., you will be expected to acknowledge messages).
       */
      noAck: false,
      /**
       * * exlusive
       * if true, the broker won’t let anyone else consume from this queue; if there already is a consumer,
       * there goes your channel (so usually only useful if you’ve made a ‘private’ queue by letting the server choose its name)
       * defaults to true
       */
      exlusive: true,
      /**
       * * priority
       * consumers which do not specify a value have priority 0.
       * larger numbers indicate higher priority, and both positive and negative numbers can be used.
       * defaults to 0
       */
      priority: 0
    })
  }

  setOpts(options) {
    this.options = {
      ...this.options,
      ...options
    }

    return this.options;
  }

  setQueueOpts(options) {
    this.queueOptions = {
      ...this.queueOptions,
      ...options
    }

    return this.queueOptions;
  }

  setConsumeOpts(options) {
    this.consumeOptions = {
      ...this.consumeOptions,
      consumerTag: [
        os.hostname(),
        process.pid,
        faker.word.adjective()
      ].join(':'),
      ...options
    }

    return this.consumeOptions;
  }

  static Handler(handler, args, timeout = 5000) {
    let waitingFor = null;
    if (timeout > -1) {
      // Create a promise that rejects in <ms> milliseconds
      waitingFor = new Promise((resolve_, reject) => {
        const z = setTimeout(() => {
          clearTimeout(z);
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(new Error(`Timeout processor leap than ${timeout}ms`));
        }, timeout);
      });
    }

    const processor = new Promise((resolve, reject) => {
      handler(args).then(() => {
        resolve(true)
      }).catch(reject);
    });

    // Returns a race between our timeout and the passed in promise
    return Promise.race(
      _.without([processor, waitingFor], null)
    );
  }

  async consume(name, route, options, processor, timeout) {
    const queue = name.trim();
    if (!queue) throw new Error('Queue name cannot empty')

    const me = this;
    const consumeOptions = {
      ...this.consumeOptions,
      ...options
    }

    const { exchange, channel } = await this.client.exchange(this.exchange, this.channel)
    Object.assign(this, {
      Channel: channel,
      Exchange: exchange,
    })

    if (this.options.prefetch) {
      await channel.prefetch(this.options.prefetch);
    }

    const Queue = await channel.assertQueue(queue, this.queueOptions);
    const Binder = await channel.bindQueue(queue, exchange, route);
    Object.assign(this, { Queue, Binder })

    let counter = 0
    return channel.consume(queue, async (message) => {
      let decoded = message.content.toString();
      try { decoded = JSON.parse(decoded) } catch (e) {
        //
      }

      const data = {
        options: { exchange, route, queue },
        message: decoded
      };

      logger.info(stringify(
        TYPE_INFO.RABBIT_MQ,
        `${MESSAGE.RABBITMQ_CONSUME} (${this.Channel._id})`,
        data
      ))

      try {
        await Subscriber.Handler(processor, message, timeout);
        await channel.ack(message);

        counter += 1;
        if (me.options.stopAt === counter) await channel.cancel(consumeOptions.consumerTag);
      } catch (e) {
        logger.warn(stringify(
          TYPE_WARN.RABBIT_MQ,
          `${MESSAGE.RABBITMQ_NOACK} (${me.name}): ${e.message}`
        ));
        await channel.nack(
          message, // the message to be rejected
          me.options.allUpTo,
          me.options.requeue
        );
      }
    }, consumeOptions);
  }
}
