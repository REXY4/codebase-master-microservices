/* eslint-disable no-unused-vars */

const Manifest = {};
const Name = 'NEW_MESSAGE';

const Joi = require('joi');

const { userMessage } = require('../emitters');
const { hasCallback, fallBack, getRoom } = require('../../../utils/socket');

const variables = Joi.object({
  type: Joi.string().valid('text', 'image', 'audio', 'video', 'href').required(),
  key: Joi.string().required(),
  value: Joi.string().required(),
})
const schema = Joi.object({
  room: Joi.string().required(),
  message: Joi.object({
    value: Joi.string().required(),
    variables: Joi.array().items(variables),
  }).required(),
});

// eslint-disable-next-line consistent-return
const handler = (data) => async function (payload, callback) {
  const { error, value } = schema.validate(payload);
  if (error) {
    console.error(error);
    return fallBack(callback, error)
  }

  const { room, message } = value;
  const dataStore = await getRoom(Manifest.redis, room);

  // Use for data model
  const from = this.iam;
  const consultation = {
    topic: {
      name: 'none',
    },
    room: dataStore,
  };

  const newMessage = new Manifest.mongo.model.Conversation({
    from, consultation, message
  })

  // Make it async
  newMessage.save(async (err, result) => {
    if (err) {
      console.error(err);
      return fallBack(callback, error)
    }
    return result
  })

  this.broadcast.to(room).emit(userMessage.name, { user: from, message: newMessage });

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
