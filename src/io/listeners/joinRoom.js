/* eslint-disable no-param-reassign */

const Manifest = {};
const Name = 'JOIN_ROOM';

const Joi = require('joi');

const { addedToRoom, userJoined } = require('../emitters');
const {
  getSocketsInRoom,
  hasCallback,
  newError,
  fallBack,
  getRoom,
  setRoom
} = require('../../../utils/socket');

const schema = Joi.object({
  room: Joi.string().required()
});

const handler = (data) => async function (payload, callback) {
  const { error, value } = schema.validate(payload);
  if (error) {
    console.error(error);
    return fallBack(callback, error)
  }

  const { room } = value;
  const participants = getSocketsInRoom(room, this)
  if (participants.length < 1) {
    const error2 = newError('Join room failed before inited', 'ERR002');
    console.error(error2)
    return fallBack(callback, error2);
  }

  const { iam } = this;
  const dataStore = await getRoom(Manifest.redis, room);

  this.uname = (iam.profile.uname || iam.profile.email).replace(/\s/g, '-').toLowerCase();
  dataStore.state = true;
  dataStore.resolvers = dataStore.resolvers || [];
  dataStore.resolvers.push(iam);
  dataStore.numOfUser = dataStore.resolvers.length + 1;

  await setRoom(Manifest.redis, room, dataStore);

  const response = { user: iam, room: dataStore }
  this.join(room);
  this.broadcast.to(room).emit(userJoined.name, response);

  if (hasCallback(callback)) return callback(response);
  return this.emit(addedToRoom.name, response);
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
