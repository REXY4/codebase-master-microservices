const { getReasonPhrase } = require('http-status-codes')
const joi = require('joi');

const id = joi.number().integer().required().min(1)

const base = {
  key: joi.string().required().example('grantType.clientCredentials'),
  value: joi.string().required().example('client_credentials'),
  notes: joi.string().allow(null, '').example('Some text'),
};

const body = joi.object().id('EnumerationBody').keys({ ...base })

const row = joi.object().id('EnumerationRow').keys({ id, ...base })

const params = joi.object().id('EnumerationParams').keys({ id })

const response = joi.object().id('EnumerationResponse').keys({
  code: joi.number().required().allow(200).example(200),
  status: joi.string().required().allow(getReasonPhrase(200)).example(getReasonPhrase(200)),
  messages: joi.array().min(0).required().allow(null)
    .items(joi.link('#Message')),
  data: joi.object().keys({
    count: joi.number().required().min(0).example(99),
    rows: joi.array().min(0).required().allow(null)
      .items(row)
  })
})

module.exports = {
  body,
  row,
  params,
  response
}
