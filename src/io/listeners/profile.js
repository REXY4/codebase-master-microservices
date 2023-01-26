const Manifest = {};
const Name = 'PROFILE';

const { userProfile } = require('../emitters');
const { hasCallback } = require('../../../utils/socket');

const handler = (data) => function (callback) {
  const response = { user: this.iam }
  if (hasCallback(callback)) {
    return callback(response)
  }
  return this.emit(userProfile.name, response);
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
