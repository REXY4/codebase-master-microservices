require('dotenv').config()

module.exports = {
  env: process.env.NODE_ENV,
  app: require('./app'),
  grpc: require('./grpc'),
  hosts: require('./hosts'),
  auth: require('./auth'),
  sql: require('./sql'),
  sqlTables: require('./sqlTables'),
  mongo: require('./mongo'),
  mongoCollections: require('./mongoCollections'),
  message: require('./message'),
  mailStandard: require('./mail-standard'),
  redis: require('./redis'),
  rabbitmq: require('./rabbitmq'),
  cron: require('./cron'),
  io: require('./io'),
  swagger: require('./swagger'),
  constants: require('./constants'),
}
