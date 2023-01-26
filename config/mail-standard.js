require('dotenv').config();

const {
  MAIL_RECEIVER, MAIL_SENDER,
  MAIL_SENDERNAME, MAIL_HOST,
  MAIL_USERNAME, MAIL_PASSWORD
} = process.env

let { MAIL_PORT } = process.env;
MAIL_PORT = typeof MAIL_PORT === 'string' ? parseInt(MAIL_PORT) : MAIL_PORT

module.exports = {
  sender: {
    name: MAIL_SENDERNAME,
    email: MAIL_SENDER
  },
  receiver: {
    email: MAIL_RECEIVER || MAIL_SENDER
  },
  transport: {
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: MAIL_PORT === 465,
    auth: {
      user: MAIL_USERNAME,
      pass: MAIL_PASSWORD
    },
    tls: { rejectUnauthorized: false },
    debug: true
  }
}
