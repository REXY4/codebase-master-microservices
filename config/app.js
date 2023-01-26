require('dotenv').config()

const codename = 'Mstr'
const { name, version, description } = require('../package.json')

const {
  APP_NAME,
  APP_PORT,
  APP_LOG_LEVEL
} = process.env

module.exports = {
  name: APP_NAME,
  port: APP_PORT,
  codename,
  packageName: name,
  version,
  description,
  logLevel: APP_LOG_LEVEL || 'debug'
}
