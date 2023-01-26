const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

async function randomString(length) {
  const saltRound = length || faker.datatype.number({ min: 8, max: 16 })
  return bcrypt.genSalt(saltRound)
}

async function set(password, salt) {
  const _salt = salt || (await randomString())
  const hash = await bcrypt.hash(password, _salt);

  return { salt: _salt, hash }
}

async function test(password, data) {
  const hash = await bcrypt.hash(password, data.salt)
  const match = await bcrypt.compare(hash, data.hash);
  return (match || hash === data.hash)
}

module.exports = { randomString, set, test }
