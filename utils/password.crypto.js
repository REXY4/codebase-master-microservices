const crypto = require('crypto')

async function randomString(length) {
  const hex = await crypto.randomBytes(length).toString('hex')
  return hex
}

async function set(password, salt) {
  const _salt = salt || (await randomString(16))
  const hash = await crypto.pbkdf2Sync(password, _salt, 10000, 512, 'sha512').toString('hex')

  return { salt: _salt, hash }
}

async function test(password, data) {
  const { salt, hash } = data
  const tryToHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex')
  return tryToHash === hash
}

module.exports = { randomString, set, test }
