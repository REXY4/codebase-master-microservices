const { Op } = require('sequelize')
const { getEnumeration } = require('./20210304100000-add-mstr-enumeration')

const getMstrResources = async () => {
  const Enum = await getEnumeration()
  return [
    // mstr-enumeration grants
    {
      code: `${Enum.app.beMaster}:enum:create`,
      name: 'Create enumeration',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beMaster}:enum:update`,
      name: 'Update enumeration by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beMaster}:enum:delete`,
      name: 'Delete enumeration by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },

    // mstr-role grants
    {
      code: `${Enum.app.beMaster}:role:read`,
      name: 'Get role(s)',
      isInternalDefault: true,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beMaster}:role:create`,
      name: 'Create role',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beMaster}:role:update`,
      name: 'Update role by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beMaster}:role:delete`,
      name: 'Delete role by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },

    // mstr-resource grants
    {
      code: `${Enum.app.beMaster}:resource:read`,
      name: 'Get resource(s)',
      isInternalDefault: true,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beMaster}:resource:create`,
      name: 'Create resource',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beMaster}:resource:update`,
      name: 'Update resource by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beMaster}:resource:delete`,
      name: 'Delete resource by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },

    // mstr-role-resource grants
    {
      code: `${Enum.app.beMaster}:role_resource:read`,
      name: 'Get role resource(s)',
      isInternalDefault: true,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beMaster}:role_resource:create`,
      name: 'Create role resource',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beMaster}:role_resource:update`,
      name: 'Update role resource by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beMaster}:role_resource:delete`,
      name: 'Delete role resource by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },

    // mstr-module grants
    {
      code: `${Enum.app.beMaster}:module:read`,
      name: 'Get module(s)',
      isInternalDefault: true,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beMaster}:module:create`,
      name: 'Create module',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beMaster}:module:update`,
      name: 'Update module by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beMaster}:module:delete`,
      name: 'Delete module by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },

    // mstr-role-module grants
    {
      code: `${Enum.app.beMaster}:role_module:read`,
      name: 'Get role module(s)',
      isInternalDefault: true,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beMaster}:role_module:create`,
      name: 'Create role module',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beMaster}:role_module:update`,
      name: 'Update role module by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beMaster}:role_module:delete`,
      name: 'Delete role module by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },

    // usr-account:all grants
    {
      code: `${Enum.app.beUser}:account:create`,
      name: 'Create account',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beUser}:account:read`,
      name: 'Get account(s)',
      isInternalDefault: true,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beUser}:account:update`,
      name: 'Update account by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beUser}:account:delete`,
      name: 'Delete account by id',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },

    // usr-account:sibling grants
    {
      code: `${Enum.app.beUser}:account:create:sibling`,
      name: 'Create account: sibling',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beUser}:account:read:sibling`,
      name: 'Get account(s): sibling',
      isInternalDefault: true,
      isExternalDefault: true,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beUser}:account:update:sibling`,
      name: 'Update account by id: sibling',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beUser}:account:delete:sibling`,
      name: 'Delete account by id: sibling',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },

    // usr-account:lower grants
    {
      code: `${Enum.app.beUser}:account:crete:lower`,
      name: 'Create account: lower',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beUser}:account:read:lower`,
      name: 'Get account(s): lower',
      isInternalDefault: true,
      isExternalDefault: true,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beUser}:account:update:lower`,
      name: 'Update account by id: lower',
      isInternalDefault: false,
      isExternalDefault: false,
      notes: 'autocreated'
    },
    {
      code: `${Enum.app.beUser}:account:delete:lower`,
      name: 'Delete account by id: lower',
      isInternalDefault: false,
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
