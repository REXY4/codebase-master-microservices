require('dotenv').config();

module.exports = {
  svc: {
    this: process.env.SVC_URL_THIS,
    oauth: process.env.SVC_URL_OAUTH,
  },
  rpc: {
    this: process.env.RPC_URL_THIS,
    oauth: process.env.RPC_URL_OAUTH,
  },
  verificator: {
    url: process.env.MS_VERIFICATOR_URL,
    username: process.env.MS_VERIFICATOR_USERNAME,
    password: process.env.MS_VERIFICATOR_PASSWORD,
  }
}
