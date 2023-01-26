require('dotenv').config()

module.exports = {
  port: process.env.GRPC_PORT || 30000,
  serviceOpts: {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
}
