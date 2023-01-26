const correlator = require('../src/logging/correlationId');

const got = async (config) => {
  const { default: req } = await import('got')
  const newRequest = await req(config)
  return newRequest
}

async function request({
  url, method = 'get', headers, payload, query, form
}) {
  const conf = {
    url,
    method,
    responseType: 'json',
    hooks: {
      beforeError: [
        (error) => {
          const { response } = error
          if (response && response.body) {
            error.message = JSON.stringify(response.body)
          }
          return error
        }
      ]
    }
  }

  if (headers) conf.headers = headers
  if (payload) conf.json = payload
  if (form) conf.form = form
  if (query) conf.searchParams = query

  conf.headers = conf.headers || {}
  conf.headers['x-correlation-id'] = correlator.getId()

  if (process.env.NODE_ENV === 'test' || !request.server) {
    console.log('Outgoing request', conf)
  } else {
    request.server.logger.info(conf, 'Outgoing request')
  }

  const httpReq = await got(conf)

  if (process.env.NODE_ENV === 'test' || !request.server) {
    console.log('Incomming response', httpReq.body)
  } else {
    request.server.logger.info(httpReq.body, 'Incomming response')
  }

  return httpReq
}

module.exports = { request }
