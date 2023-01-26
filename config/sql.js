require('dotenv').config()

const fs = require('fs')

const config = {
  username: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DBNAME,
  host: process.env.SQL_HOST,
  port: process.env.SQL_PORT,
  dialect: process.env.SQL_DIALECT,
  pool: {
    // * If time has reached, will given an error:
    // * ConnectionAcquireTimeoutError [SequelizeConnectionAcquireTimeoutError]: Operation timeout
    min: 0, // default: 0
    max: 5, // default: 5
    idle: 5000, // default: 10000
    acquire: 60000 // default: 60000
  },
  dialectOptions: {
    charset: process.env.SQL_CHARSET,
    collate: process.env.SQL_COLLATE,
    supportBigNumbers: true,
    bigNumberStrings: true,
    options: {
      // * Non MSSQL dialect will force to ignore all of these options
      // * If time has reached, will given an error:
      // * DatabaseError [SequelizeDatabaseError]: Timeout: Request failed to complete in $requestTimeout ms
      cancelTimeout: 5000, // default: 5000
      requestTimeout: 15000 // default: 15000
    }
  },
  logConnection: true, // process.env.NODE_ENV !== 'production'
  logQueryParameters: false,
  migrationStorage: 'sequelize',
  migrationStorageTableName: '_mstrMetas',
  seederStorage: 'sequelize',
  seederStorageTableName: '_mstrSeeds',
  query: {
    dateTime: process.env.SQL_QUERY_DATETIME || 'SELECT CURRENT_TIMESTAMP'
  }
}

if (process.env.NODE_ENV === 'production') {
  config.logging = false
}

if (config.dialect === 'mssql') {
  config.dialectOptions.options = {
    ...config.dialectOptions.options,
    enableArithAbort: true
  }
} else if (config.dialect === 'mysql') {
  delete config.dialectOptions.options
  delete config.dialectOptions.collate
} else if (config.dialect === 'postgres') {
  delete config.dialectOptions
}

try {
  const cert = fs.readFileSync(process.env.SQL_SSLKEY);
  config.dialectOptions.ssl = {
    require: true,
    rejectUnauthorized: true,
    ca: [cert]
  };
} catch (e) {
  if (process.env.SQL_SSLKEY) {
    console.error(`SQL_SSLKEY=${process.env.SQL_SSLKEY} key doesn't found!`)
    console.error(e)
    process.exit()
  }
}

module.exports = config
