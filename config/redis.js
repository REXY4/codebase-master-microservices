require('dotenv').config();

module.exports = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  family: 4, // 4 (IPv4) or 6 (IPv6)
  db: process.env.REDIS_DB || 0,
  username: process.env.REDIS_USERNAME || 'default',
  password: process.env.REDIS_PASSWORD || '',
}
