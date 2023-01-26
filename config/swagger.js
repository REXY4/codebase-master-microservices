const { SVC_URL_THIS } = process.env
const { name, version, description } = require('../package.json')

const host = SVC_URL_THIS.replace(/http(s?):\/\//g, '')

let basePath = host.split('/').slice(1).join('/')
basePath = (basePath ? `/${basePath}` : '')

// FIXME: Use valid additional description
const notes = 'You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on '
+ '[irc.freenode.net, #swagger](http://swagger.io/irc/). '
+ 'For this sample, you can use the api key `special-key` to test the authorization filters.'

module.exports = {
  openapi: '3.0.1',
  info: {
    title: name,
    description: [description, notes].join('. '),
    termsOfService: 'http://swagger.io/terms/', // FIXME: Use valid terms site
    contact: {
      email: 'ifundeasy@gmail.com'
    },
    license: {
      // FIXME: Use valid license type
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
    },
    version: '1.0.0'
  },
  externalDocs: {
    // FIXME: Use valid external docs
    description: 'Find out more about Swagger',
    url: 'http://swagger.io'
  },
  servers: [
    {
      url: `http://${host}${basePath}`,
      description: `${name}`
    },
    {
      url: `https://${host}${basePath}`,
      description: `${name} (SSL)`
    }
  ],
  tags: [],
  paths: {},
  security: [
    {
      bearerAuth: [],
    }
  ],
  components: {
    schemas: {},
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
}
