const os = require('os');
const _ = require('lodash');

const { Subscriber } = require('../rabbitmq');
const EnumerationClientRPC = require('../grpc-client/enumeration');
const logger = require('../logging/createLoggerCron')(__filename);
const correlationId = require('../logging/correlationIdCron');
const Ping = require('../grpc-client/ping');
const { stringify, objError } = require('../logging/format/common');
const { TYPE_ERROR, TYPE_INFO } = require('../../config/constants');
const { until } = require('../../utils');

const syncEnum = async (manifest, exit) => {
  const enumerationClientRPC = new EnumerationClientRPC();
  const check = new Ping(enumerationClientRPC.module.host)
  try {
    await until(async () => {
      const res = await check.ping()
      return res.message === 'pong'
    }, `Resolving GRPC ${enumerationClientRPC.module.host} host`);

    const data = await enumerationClientRPC.getAll();
    manifest.config.enums = manifest.config.enums || {}
    const Enums = data.rows.reduce((o, { key, value }) => _.set(o, key, value), {});
    if (Object.keys(Enums).length) Object.assign(manifest.config.enums, Enums);
  } catch (err) {
    if (exit) throw err;
    else logger.error(stringify(TYPE_ERROR.GRPC_CLIENT, objError(err)));
  }
}

module.exports = async (manifest) => {
  const { Enum } = manifest.config.rabbitmq.queue;
  const queueName = `${Enum.queue}:${os.hostname()}`
  const subscriber = new Subscriber(manifest.rmq, Enum.exchange, manifest.rmq.channel)

  await syncEnum(manifest, true);

  subscriber.consume(queueName, Enum.route, null, async (msg) => {
    logger.info(stringify(
      `${TYPE_INFO.RABBIT_MQ}`,
      `Consuming ${queueName}: ${msg.content.toString()}`
    ));
    correlationId.storeId();
    await syncEnum(manifest);
  }, -1);
}
