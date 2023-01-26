require('dotenv').config()

const config = {
  username: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
  database: process.env.MONGO_DBNAME,
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  pool: {
    bufferCommands: true,
    minPoolSize: 0,
    maxPoolSize: 5,
    connectTimeoutMS: 30000, // default: 30000
    socketTimeoutMS: 30000, // default: 30000
    serverSelectionTimeoutMS: 30,
    heartbeatFrequencyMS: 1000
  },
  family: 4,
  autoIndex: false,
  logConnection: true, // process.env.NODE_ENV !== 'production'
}

if (process.env.NODE_ENV === 'production') {
  config.logging = false
}

module.exports = config
