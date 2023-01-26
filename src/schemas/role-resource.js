const { getReasonPhrase } = require('http-status-codes')
const joi = require('joi');

const id = joi.number().integer().required().min(1)

const base = {
  mstrRoleId: joi.number().required().example(4),
  mstrResourceId: joi.number().required().example(12),
  notes: joi.string().allow(null, '').example('Some text')
};

const body = joi.object().id('RoleResourceBody').keys({ ...base })

const row = joi.object().id('RoleResourceRow').keys({
  id,
  ...base,
  mstrRole: joi.link('#RoleRow'),
  mstrResource: joi.link('#ResourceRow')
})

const params = joi.object().id('RoleResourceParams').keys({ id })

const response = joi.object().id('RoleResourceResponse').keys({
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
