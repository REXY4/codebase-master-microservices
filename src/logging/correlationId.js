const cls = require('cls-hooked');
const uuid = require('uuid');

const store = cls.createNamespace('cid-ns');

function withId(fn, id) {
  store.run(() => {
    store.set('id', id || uuid.v4());
    fn();
  });
}

function getId() {
  return store.get('id');
}

module.exports = {
  withId,
  getId,
  bindEmitter: store.bindEmitter.bind(store),
  bind: store.bind.bind(store)
};
