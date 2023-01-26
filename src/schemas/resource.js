const { getReasonPhrase } = require('http-status-codes')
const joi = require('joi');

const id = joi.number().integer().required().min(1)

const base = {
  code: joi.string().required().example('be-master:enum:create'),
  name: joi.string().required().example('Create enumeration'),
  isInternalDefault: joi.boolean().required().example(false),
  isExternalDefault: joi.boolean().required().example(false),
  notes: joi.string().allow(null, '').example('Some text'),
};

const body = joi.object().id('ResourceBody').keys({ ...base })

const row = joi.object().id('ResourceRow').keys({ id, ...base })

const params = joi.object().id('ResourceParams').keys({ id })

const response = joi.object().id('ResourceResponse').keys({
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
