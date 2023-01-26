const { getReasonPhrase } = require('http-status-codes')
const joi = require('joi');

const base = {
  name: joi.string().required().example('maria'),
  status: joi.string().required().example('up'),
  notes: joi.string().allow(null, '').example('Some text'),
};

const response = joi.object().id('HealthCheckResponse').keys({
  code: joi.number().required().allow(200).example(200),
  status: joi.string().required().allow(getReasonPhrase(200)).example(getReasonPhrase(200)),
  messages: joi.array().min(0).required().allow(null)
    .items(joi.link('#Message')),
  data: joi.array().min(0).required().allow(null)
    .items(joi.object().keys({
      ...base
    }))
})

module.exports = { response }
