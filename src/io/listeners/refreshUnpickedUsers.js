const Manifest = {};
const Name = 'REFRESH_UNPICKED_USERS';
const Promise = require('bluebird');

const { hasCallback } = require('../../../utils/socket');
const { unpickedUsers } = require('../emitters');

// eslint-disable-next-line no-unused-vars, func-names
const handler = (data) => async function (callback) {
  const keys = await Manifest.redis.keys('roomof::*');
  const rooms = await Promise.map(keys, async (room) => JSON.parse(await Manifest.redis.get(room)))
    .filter((room) => typeof room === 'object');
  const response = { rooms };

  if (hasCallback(callback)) return callback(response);
  return this.emit(unpickedUsers.name, response)
};

module.exports = function (manifest) {
  Manifest.sql = manifest.sql
  Manifest.mongo = manifest.mongo
  Manifest.redis = manifest.redis

  return {
    active: true,
    name: Name,
    handler
  }
};
