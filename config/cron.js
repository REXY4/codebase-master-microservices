require('dotenv').config()

module.exports = {
  cronTime: process.env.CRON_TIME || '0 0 * * * *'
}
