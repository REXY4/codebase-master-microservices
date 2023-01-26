const cls = require('cls-hooked');
const uuid = require('uuid');

const store = cls.createNamespace('ns-cid-grpc');

const withId = (fn, value) => new Promise((resolve) => {
  store.run(() => {
    store.set('id', value || uuid.v4());
    resolve(fn());
  });
});

function getId() {
  return store.get('id');
}

module.exports = {
  withId,
  getId,
  bindEmitter: store.bindEmitter.bind(store),
  bind: store.bind.bind(store)
};
