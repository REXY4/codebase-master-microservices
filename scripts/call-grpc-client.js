/* eslint-disable import/newline-after-import */

const { random } = require('../utils/string');

// example of usage: book grpc server
const Book = require('../src/grpc-client/book');

// example of usage: enumeration grpc server
const Enumeration = require('../src/grpc-client/enumeration');
const enumeration = new Enumeration();
enumeration.create({ key: `misc.unused.${random(5)}`, value: random(10), notes: random() }).then(console.log);
enumeration.getAll().then(console.log)
enumeration.getById(1).then(console.log)

// example of usage: role resource grpc server
const RoleResource = require('../src/grpc-client/role-resource');
const roleResource = new RoleResource();
roleResource.getAll().then(console.log)
