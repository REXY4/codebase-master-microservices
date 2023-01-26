const { faker } = require('@faker-js/faker')

const { random, datatype, internet } = faker

const newCode = () => datatype.uuid()

const newName = () => random.words()

const newSecret = () => internet.password()

const newClient = (options = {}) => {
  const code = options.code || newCode()
  const name = options.name || newName()
  const secret = options.secret || newSecret()
  return { code, name, secret }
}

module.exports = {
  newCode, newName, newSecret, newClient
}
