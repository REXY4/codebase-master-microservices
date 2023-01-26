/* eslint-disable no-param-reassign */

const Manifest = {};
const Name = 'disconnect'; // * lowercase will means built-in socket.io event

const handler = (data) => function (reason) {
  console.warn({
    ns: this.nsp.name,
    packet: [Name, reason],
    user: this.iam
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
