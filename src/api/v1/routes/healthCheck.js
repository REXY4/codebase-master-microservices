const { HealthCheck: HealthCheckHandler } = require('../handlers');
const { HealthCheck: HealthCheckSchema } = require('../../../schemas')

const definition = {
  name: 'HealthCheck',
  basePath: '/api/v1/healthcheck',
  description: 'HealthCheck APIs v1',
  routes: [
    {
      enabled: true,
      method: 'get',
      path: '/',
      summary: 'List of service',
      description: 'Get services statuses',
      action: [
        HealthCheckHandler.checkAll
      ],
      responseExamples: [
        {
          code: 200,
          description: 'OK: HealthCheck',
          mediaType: 'application/json',
          schema: HealthCheckSchema.response
        }
      ]
    }
  ]
}

module.exports = definition;
