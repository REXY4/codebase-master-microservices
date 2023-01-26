const joi = require('joi');
const { getReasonPhrase } = require('http-status-codes')

const Schema = {};

Schema.Header = {
  name: 'Header',
  description: 'Example request headers',
  schema: joi.object().keys({
    authorization: joi.string().required().description('Access token').example('Bearer eyJhbGciOiJIU...vU17rT3H8uErLjHA'),
  })
}
Schema.Query = {
  name: 'Query',
  description: 'Example request query string',
  schema: joi.object().keys({
    filters: joi.object().allow(null).description('Data Filters with key value')
      .example({ name: 'High School' }),
    search: joi.object().allow(null).keys({
      fields: joi.alternatives(joi.string(), joi.array()).example('name'),
      value: joi.string().example('Name')
    }).example({ search: { fields: 'name', value: 'High School' } })
      .description('Search multiple column with array on field'),
    sort: joi.string().allow(null).description('Data sorter with direction [json stringify]; default=null')
      .example(JSON.stringify([['name', 'desc'], ['age', 'asc']])),
    page: joi.number().allow(null).description('Page of data; default=10').example(1),
    pageSize: joi.number().allow(null).description('Total data return; default=5').example(5)
  })
}
Schema.Data = {
  name: 'Data',
  description: 'Example response data',
  schema: joi.object().keys({
    count: joi.number().required().description('Total stored data').example(100),
    rows: joi.array().min(1).required().allow(null)
      .items(joi.string().example('{ ... }'))
      .example(JSON.stringify({ name: 'John', age: 18 })),
  })
}
Schema.Message = {
  name: 'Message',
  description: 'Non default HTTP error code',
  schema: joi.object().keys({
    code: joi.string().required().example('XYZ-1001'),
    message: joi.string().required().example('Spesific error/info message to be described here')
  })
}

const StatusCodes = [
  200, // * You know this
  400, // * When headers wrong
  401, // * When user is not valid
  403, // * When user is valid, but resource is resctricted to access
  404, // * When resource is not found
  422, // * When format of payload, or query were wrong (joi validation)
  500, // * When interupted error from server
  503, // * When under maintenance, construction or development in progress
  // 100, 201, 202, 301, 302, 307, 308,
  // 405, 415, 429, 503, 504, 511
];

StatusCodes.forEach(statusCode => {
  // eslint-disable-next-line
  Schema[statusCode] = createSchema(statusCode)
})

function createSchema(httpCode) {
  const nullable = joi.string().allow(null);
  return {
    name: getReasonPhrase(httpCode).replace(/\s/g, ''),
    description: getReasonPhrase(httpCode),
    schema: joi.object().keys({
      code: joi.number().required().example(httpCode),
      status: joi.string().required().example(getReasonPhrase(httpCode)),
      messages: httpCode === 200 ? nullable : joi.array().min(1).required().allow(null)
        .items(joi.link('#Message')),
      data: httpCode !== 200 ? nullable : joi.array().min(1).required().allow(null)
        .items(joi.link('#Data'))
    })
  }
}

module.exports = Schema;
