const uuid = require('uuid');
const Cache = require('node-cache');

const caching = new Cache();
const ns = 'cid-ns-cron';

function storeId() {
  const store = caching.set(ns, uuid.v4());
  return store;
}

function getId() {
  const get = caching.get(ns);
  return get;
}

module.exports = {
  storeId,
  getId
};
