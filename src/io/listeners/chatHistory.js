const Manifest = {};
const Name = 'CHAT_HISTORY';
// const Joi = require('joi');
// const { chatHistoryCollected } = require('../emitters');

// const schema = Joi.object({
//   room: Joi.string().required(),
//   start: Joi.number().integer().greater(-1).required(),
//   limit: Joi.number().integer().greater(0).required()
// });

// eslint-disable-next-line no-unused-vars, func-names, consistent-return
const handler = (data) => async function (payload, callback) {
  // TODO: Add handler
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
