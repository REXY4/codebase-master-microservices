const Manifest = {};
const Name = 'REJOIN_ROOM';

const Joi = require('joi');

const { userRejoined } = require('../emitters');
const {
  hasCallback,
  fallBack,
  getRoom,
} = require('../../../utils/socket');

const schema = Joi.object({
  room: Joi.string().required()
});

// eslint-disable-next-line consistent-return
const handler = (data) => async function (payload, callback) {
  const { error, value } = schema.validate(payload);
  if (error) {
    console.error(error);
    return fallBack(callback, error)
  }

  const { iam } = this;
  const { room } = value;
  const dataStore = await getRoom(Manifest.redis, room);

  this.uname = (iam.profile.uname || iam.profile.email).replace(/\s/g, '-').toLowerCase();

  const response = { user: this.iam, room: dataStore }
  this.join(room);
  this.broadcast.to(room).emit(userRejoined.name, response);

  if (hasCallback(callback)) return callback(response);
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
