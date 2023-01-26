const parse = require('joi-to-json')
// const { getReasonPhrase } = require('http-status-codes')

const config = require('../../../config')
const { Common: CommonSchema } = require('../../schemas')

Object.entries(CommonSchema).forEach(([key, value]) => {
  config.swagger.components.schemas[value.name || key] = parse(value.schema, 'open-api')
})

const ROUTE_DEF = {
  tags: [],
  summary: '',
  description: '',
  parameters: [],
  responses: {}
}

Object.entries(CommonSchema).forEach(([httpCode, schema]) => {
  if (!parseInt(httpCode) || parseInt(httpCode) === '200') return;

  ROUTE_DEF.responses[httpCode] = {
    description: `<b><mark>${schema.name}</mark></b> schema`,
    /**
     * * Uncomment if you want to show schema;
     * * and, comment it if other else
     */
    // content: {
    //   'application/json': {
    //     schema: {
    //       $ref: `#/components/schemas/${getReasonPhrase(httpCode).replace(/\s/g, '')}`
    //     }
    //   }
    // }
  }
})

module.exports = {
  DOCS_DEF: config.swagger,
  ROUTE_DEF
}
