const { CronJob } = require('cron');

const logger = require('../logging/createLoggerCron')(__filename);
const correlationId = require('../logging/correlationIdCron');
const { cron: opts } = require('../../config');

class Cron {
  constructor(mainfest) {
    this.mainfest = mainfest;
    this.time = opts.cronTime;
  }

  #create(key, time, onTick, onComplete = null) {
    this.job = this.job || {};
    this.job[key] = new CronJob(time || this.time, onTick, onComplete);

    if (!this.job[key].running) this.job[key].start();
  }

  jobTest(onComplete) {
    this.#create('test', '0 */5 * * * *', () => {
      correlationId.storeId();
      logger.info('Job spawned!');
    }, onComplete)
  }
}

module.exports = Cron;
