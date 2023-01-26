const Manifest = {};
const Name = 'TYPING';

const Joi = require('joi');

const { userTyping } = require('../emitters');
const { hasCallback, fallBack } = require('../../../utils/socket');

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

  const { room } = value;
  const roomData = JSON.parse(await Manifest.redis.get(room));
  this.broadcast.to(room).emit(userTyping.name, {
    user: this.iam,
    room: roomData
  });

  if (hasCallback(callback)) {
    return callback(true);
  }
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
