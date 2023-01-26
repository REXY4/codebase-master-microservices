const { Op } = require('sequelize')
const { getEnumeration } = require('./20210304100000-add-mstr-enumeration')

const getMstrResources = async () => {
  const Enum = await getEnumeration()
  return [
    // courTemplates grants
    {
      code: `${Enum.app.beCourier}:template:read`,
      name: 'Get template(s)',
      isInternalDefault: true,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beCourier}:template:create`,
      name: 'Create template',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beCourier}:template:update`,
      name: 'Update template by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beCourier}:template:delete`,
      name: 'Delete template by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },

    // courContexts grants
    {
      code: `${Enum.app.beCourier}:context:read`,
      name: 'Get context(s)',
      isInternalDefault: true,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beCourier}:context:create`,
      name: 'Create context',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beCourier}:context:update`,
      name: 'Update context by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beCourier}:context:delete`,
      name: 'Delete context by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },

    // courNotifications grants
    {
      code: `${Enum.app.beCourier}:notification:read`,
      name: 'Get notification(s)',
      isInternalDefault: true,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beCourier}:notification:create`,
      name: 'Create notification',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beCourier}:notification:update`,
      name: 'Update notification by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beCourier}:notification:delete`,
      name: 'Delete notification by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },

    // courRegistrations grants
    {
      code: `${Enum.app.beCourier}:registration:read`,
      name: 'Get registration(s)',
      isInternalDefault: true,
      isExternalDefault: false,
      notes: 'autocreated'
    },

    // courJobs grants
    {
      code: `${Enum.app.beCourier}:job:read`,
      name: 'Get job(s)',
      isInternalDefault: true,
      isExternalDefault: false,
      notes: 'autocreated'
    }
  ]
}
const getExisting = async (queryInterface) => {
  const mstrResources = await getMstrResources()
  const selection = await queryInterface.rawSelect('mstrResources', {
    where: {
      [Op.or]: mstrResources.map((d) => ({
        code: d.code,
        name: d.name,
        deletedAt: { [Op.is]: null }
      }))
    },
    plain: false
  }, ['id'])

  return selection
}

module.exports = {
  getMstrResources,
  getExisting,
  up: async (queryInterface, Sequelize) => {
    const existData = await getExisting(queryInterface)
    const mstrResources = existData.length ? [] : (await getMstrResources())

    return queryInterface.bulkInsert('mstrResources', mstrResources)
  },
  down: async (queryInterface, Sequelize) => {
    const mstrResources = await getMstrResources()

    return queryInterface.bulkDelete('mstrResources', {
      [Op.or]: mstrResources.map((d) => ({
        code: d.code,
        name: d.name,
        deletedAt: { [Op.is]: null }
      }))
    })
  }
}
