/* eslint-disable no-param-reassign */

const Manifest = {};
const Name = 'LEAVE_ROOM';

const Joi = require('joi');

const { leaveFromRoom, userLeft } = require('../emitters');
const {
  getSocketsInRoom,
  hasCallback,
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
  const { iam } = this;

  // FIXME: Get from enumeration
  const publicRoles = ['client', 'expert'];

  let dataStore = await getRoom(Manifest.redis, room);
  if (iam.roles.filter(role => publicRoles.includes(role)).length) {
    await setRoom(Manifest.redis, room);
  } else {
    const participants = getSocketsInRoom(room, this)
      .filter((socket) => socket.id !== this.id)
      .map((user) => user.iam)
      .filter((user) => !user.roles.filter(role => publicRoles.includes(role)).length)

    dataStore = await getRoom(Manifest.redis, room);
    dataStore.state = true;
    dataStore.resolvers = participants;
    dataStore.numOfUser = dataStore.resolvers.length;

    await setRoom(Manifest.redis, room, dataStore);
  }

  const response = { user: iam, room: dataStore }
  this.leave(room);
  this.to(room).emit(userLeft.name, response);

  if (hasCallback(callback)) return callback(response);
  return this.emit(leaveFromRoom.name, response);
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
