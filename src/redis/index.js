const fs = require('fs');
const { createClient } = require('redis');
const logger = require('../logging/createLogger')(__filename);
const { stringify, objError } = require('../logging/format/common');
const {
  TYPE_INFO,
  TYPE_ERROR,
  MESSAGE
} = require('../../config/constants');

const register = async (opts) => {
  const redisPassword = fs.existsSync(opts.password)
    ? fs.readFileSync(opts.password).toString().replace(/\n$/, '')
    : opts.password;

  const acl = redisPassword ? `${opts.username}:${redisPassword}@` : '';
  const config = {
    url: `redis://${acl}${opts.host}:${opts.port}`
  };

  const redis = createClient(config);

  redis.on('connect', async () => {
    logger.info(stringify(
      TYPE_INFO.REDIS,
      MESSAGE.REDIS_CONNECTED
    ));
  });

  redis.on('error', (error) => {
    logger.error(stringify(
      TYPE_ERROR.REDIS,
      objError(error)
    ));
  });

  await redis.connect();
  await redis.select(opts.db);

  return redis;
}

module.exports = register;
