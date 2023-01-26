const { Op } = require('sequelize')

const getMstrRoles = () => [
  // internal
  {
    code: 'owner',
    name: 'Owner',
    isInternal: true,
    isDefault: false,
    notes: 'autocreated'
  },
  {
    code: 'admin',
    name: 'Admin',
    isInternal: true,
    isDefault: false,
    notes: 'autocreated'
  },
  {
    code: 'verificator',
    name: 'Verificator',
    isInternal: true,
    isDefault: false,
    notes: 'autocreated'
  },
  {
    code: 'finance',
    name: 'Finance',
    isInternal: true,
    isDefault: false,
    notes: 'autocreated'
  },
  {
    code: 'management',
    name: 'Management',
    isInternal: true,
    isDefault: false,
    notes: 'autocreated'
  },
  {
    code: 'customer_service',
    name: 'Customer Service',
    isInternal: true,
    isDefault: true,
    notes: 'autocreated'
  },
  // external
  {
    code: 'client',
    name: 'Client',
    isInternal: false,
    isDefault: true,
    notes: 'autocreated'
  },
  {
    code: 'expert',
    name: 'Expert',
    isInternal: false,
    isDefault: true,
    notes: 'autocreated'
  },
]
const getExisting = async (queryInterface) => {
  const mstrRoles = getMstrRoles()
  const selection = await queryInterface.rawSelect('mstrRoles', {
    where: {
      [Op.or]: mstrRoles.map((d) => ({
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
  getMstrRoles,
  getExisting,
  up: async (queryInterface, Sequelize) => {
    const existData = await getExisting(queryInterface)
    const mstrRoles = existData.length ? [] : getMstrRoles()

    return queryInterface.bulkInsert('mstrRoles', mstrRoles)
  },
  down: async (queryInterface, Sequelize) => {
    const mstrRoles = getMstrRoles()

    return queryInterface.bulkDelete('mstrRoles', {
      [Op.or]: mstrRoles.map((d) => ({
        code: d.code,
        name: d.name,
        deletedAt: { [Op.is]: null }
      }))
    })
  }
}
