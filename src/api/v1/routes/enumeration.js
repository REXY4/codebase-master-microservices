const { Enumeration: EnumerationHandler } = require('../handlers');
const { authentication, authorization, validation } = require('../middlewares');
const { Enumeration: EnumerationSchema } = require('../../../schemas')
const { Common: CommonSchema } = require('../../../schemas')

const definition = {
  name: 'Enumeration',
  basePath: '/api/v1/enumeration',
  description: 'Enumeration APIs v1',
  routes: [
    {
      enabled: true,
      method: 'post',
      path: '/',
      summary: 'Add new enumeration',
      description: 'Create new enumeration data',
      scopes: ['enum:create'],
      action: [
        validation(CommonSchema.Header.schema, 'headers'),
        authentication,
        authorization,
        validation(EnumerationSchema.body, 'body'),
        EnumerationHandler.create
      ],
      validators: {
        headers: CommonSchema.Header.schema,
        body: EnumerationSchema.body
      },
      responseExamples: [
        {
          code: 200,
          description: 'OK: Enumeration',
          mediaType: 'application/json',
          schema: EnumerationSchema.response
        }
      ]
    },
    {
      enabled: true,
      method: 'get',
      path: '/:id',
      summary: 'Get an enumeration',
      description: 'Get enumeration by id',
      action: [
        validation(EnumerationSchema.params, 'params'),
        EnumerationHandler.getOneBy
      ],
      validators: {
        // ? Why #EnumerationParams Schema didn't appear in Swagger UI
        params: EnumerationSchema.params
      },
      responseExamples: [
        {
          code: 200,
          description: 'OK: Enumeration',
          mediaType: 'application/json',
          schema: EnumerationSchema.response
        }
      ]
    },
    {
      enabled: true,
      method: 'get',
      path: '/',
      summary: 'List of enumerations',
      description: 'Get multiple enumerations',
      action: [
        validation(CommonSchema.Query.schema, 'query'),
        EnumerationHandler.getBy
      ],
      validators: {
        query: CommonSchema.Query.schema
      },
      responseExamples: [
        {
          code: 200,
          description: 'OK: Enumeration',
          mediaType: 'application/json',
          schema: EnumerationSchema.response
        }
      ]
    },
    {
      enabled: true,
      method: 'delete',
      path: '/:id',
      summary: 'Delete an enumeration',
      description: 'Delete an enumeration by id',
      scopes: ['enum:delete'],
      action: [
        validation(CommonSchema.Header.schema, 'headers'),
        authentication,
        authorization,
        validation(EnumerationSchema.params, 'params'),
        EnumerationHandler.deleteOneBy
      ],
      validators: {
        headers: CommonSchema.Header.schema,
        // ? Why #EnumerationParams Schema didn't appear in Swagger UI
        params: EnumerationSchema.params
      },
      responseExamples: [
        {
          code: 200,
          description: 'OK: Enumeration',
          mediaType: 'application/json',
          schema: EnumerationSchema.response
        }
      ]
    },
    {
      enabled: true,
      method: 'put',
      path: '/:id',
      summary: 'Update an enumeration',
      description: 'Update an enumeration by id',
      scopes: ['enum:update'],
      action: [
        validation(CommonSchema.Header.schema, 'headers'),
        authentication,
        authorization,
        validation(EnumerationSchema.params, 'params'),
        validation(EnumerationSchema.body, 'body'),
        EnumerationHandler.updateOneBy
      ],
      validators: {
        headers: CommonSchema.Header.schema,
        // ? Why #EnumerationParams Schema didn't appear in Swagger UI
        params: EnumerationSchema.params,
        body: EnumerationSchema.body
      },
      responseExamples: [
        {
          code: 200,
          description: 'OK: Enumeration',
          mediaType: 'application/json',
          schema: EnumerationSchema.response
        }
      ]
    },
  ]
}

module.exports = definition;
