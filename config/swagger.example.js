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
      external: [],
      basicAuth: [],
      clientId: [],
      identity: [],
      bearerAuth: [],
    }
  ],
  components: {
    schemas: {},
    securitySchemes: {
      basicAuth: {
        type: 'http',
        scheme: 'basic'
      },
      external: {
        /* FIXME: Use real oAuth 2.0 */
        type: 'oauth2',
        description: 'This API uses OAuth 2 with the implicit grant flow. [More info](https://api.example.com/docs/auth)',
        flows: {
          implicit: {
            authorizationUrl: 'http://petstore.swagger.io/oauth/dialog',
            scopes: {
              'write:data': 'modify data in your account',
              'read:data': 'read your data'
            }
          }
        }
      },
      clientId: {
        type: 'apiKey',
        name: 'X-CLIENT-ID',
        in: 'header'
      },
      identity: {
        type: 'apiKey',
        name: 'X-IDENTITY',
        in: 'header'
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
}
