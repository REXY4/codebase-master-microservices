const json = require('morgan-json');
const { message: Err } = require('../../../config');

const httpLogMinimal = json({
  method: ':method',
  url: ':url'
});

const httpLog = json({
  method: ':method',
  url: ':url',
  status: ':status',
  contentLength: ':res[content-length]',
  responseTime: ':response-time ms'
});

const stringify = (type, message, reference) => JSON.stringify({
  ...{
    type,
    message,
    reference
  }
}, 0, 2);

const objError = (error) => {
  const {
    code,
    message,
    stack,
    isCustom
  } = error;

  return {
    code,
    reason: (message || '').split('\n').length > 1 ? message.split('\n') : message,
    stack: (stack || '').split('\n').length > 1 ? stack.split('\n') : stack,
    isCustom
  }
};

const newError = (key, lang) => {
  const { message, code } = Err.get(key, lang)
  const error = new Error(message);
  error.code = code;
  error.isCustom = true;

  return error
};

module.exports = {
  httpLogMinimal,
  httpLog,
  stringify,
  objError,
  newError
};
