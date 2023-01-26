const { getReasonPhrase } = require('http-status-codes')
const joi = require('joi');

const id = joi.number().integer().required().min(1)

const base = {
  code: joi.string().required().example('fe-ms-web-client:project:create'),
  name: joi.string().required().example('Create project'),
  parameter: joi.object().description('Any parameter needs').example('{ "query": 123 }'),
  notes: joi.string().allow(null, '').example('Some text'),
};

const body = joi.object().id('ModuleBody').keys({ ...base })

const row = joi.object().id('ModuleRow').keys({ id, ...base })

const params = joi.object().id('ModuleParams').keys({ id })

const response = joi.object().id('ModuleResponse').keys({
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
