const jwt = require('jsonwebtoken')
const { auth } = require('../config')

async function generate(data) {
  return jwt.sign(data, auth.secret, {
    algorithm: auth.algorithm,
  })
}

async function decode(token) {
  return jwt.verify(token, auth.public ? auth.public : auth.secret, { algorithm: auth.algorithm })
}

module.exports = { generate, decode }
