const Promise = require('bluebird');

module.exports = async (condition, message, time = 1000, trial = 3) => {
  try {
    if (!(condition instanceof Function) && condition === true) return Promise.resolve(true);

    return new Promise((resolve, reject) => {
      let count = 0;
      const timer = setInterval(async () => {
        try {
          count += 1;

          const res = await condition();
          if (res) {
            clearInterval(timer);
            resolve(true);
          }
        } catch (e) {
          console.warn(`Trying (${count}/${trial})${message ? ` for "${message}"` : ''}: ${e.message}`)
          if (count === trial) {
            clearInterval(timer);
            reject(e);
          }
        }
      }, time);
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
