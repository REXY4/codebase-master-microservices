/* eslint-disable no-param-reassign */
const Promise = require('bluebird');

const Manifest = {};
const Name = 'disconnecting'; // * lowercase will means built-in socket.io event

const { userLeft } = require('../emitters');
const { getRoom } = require('../../../utils/socket');

const handler = (data) => async function (reason) {
  console.warn({
    ns: this.nsp.name,
    packet: [Name, reason],
    user: this.iam
  })

  const rooms = Array.from(this.rooms).filter((room) => room !== this.id);
  Promise.map(rooms, async (room) => {
    try {
      const dataStore = await getRoom(Manifest.redis, room);
      this.to(room).emit(userLeft.name, {
        user: this.iam,
        room: dataStore
      });
    } catch (e) {
      // eslint-disable-next-line no-console
    }
  })
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
