const moment = require('moment-timezone');

module.exports = {
  now() {
    return moment()
  },
  utcNow() {
    return moment.utc()
  },
  format(time) {
    return time.format('YYYY-MM-DDTHH:mm:ss.SSSSZ')
  },
};
