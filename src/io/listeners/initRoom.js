/* eslint-disable no-param-reassign */

const Manifest = {};
const Name = 'INIT_ROOM';

const { addedToRoom, userJoined } = require('../emitters');
const {
  getSocketsInRoom,
  hasCallback,
  newError,
  fallBack,
  setRoom
} = require('../../../utils/socket');

const handler = (data) => async function (callback) {
  const { iam } = this;
  const { roles, profile } = iam;
  this.uname = (profile.uname || profile.email).replace(/\s/g, '-').toLowerCase();

  const room = this.adapter.nsp.name === '/public' ? `roomof::${this.uname}` : `private::${this.uname}`;
  const participants = getSocketsInRoom(room, this);

  // FIXME: Get from enumeration
  const publicRoles = ['client', 'expert'];

  // FIXME: This should be filtered only for another PUBLIC too
  const sessionCount = participants.filter((sock) => sock.iam.roles.filter(role => publicRoles.includes(role)).length);

  if (roles.filter(role => publicRoles.includes(role)).length && (sessionCount.length > 0)) {
    const error = newError('Unable to join room', 'ERR001');
    console.error(error);
    return fallBack(callback, error)
  }

  const dataStore = await setRoom(Manifest.redis, room, {
    name: room,
    state: false,
    numOfUser: 1,
    resolvers: []
  });

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
