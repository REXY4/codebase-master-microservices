const { Op } = require('sequelize')
const { getMstrRoles } = require('./20210425153715-add-mstr-role')
const { getMstrResources } = require('./20221021163621-add-mstr-resource')

const getRoleResources = async (queryInterface) => {
  const mstrRoles = getMstrRoles()
  const mstrRoleIds = await queryInterface.rawSelect('mstrRoles', {
    where: {
      [Op.or]: mstrRoles.map((d) => ({
        code: d.code,
        name: d.name,
        deletedAt: { [Op.is]: null }
      }))
    },
    plain: false
  }, ['id'])

  const mstrResources = await getMstrResources()
  const mstrResourceIds = await queryInterface.rawSelect('mstrResources', {
    where: {
      [Op.or]: mstrResources.map((d) => ({
        code: d.code,
        name: d.name,
        deletedAt: { [Op.is]: null }
      }))
    },
    plain: false
  }, ['id'])

  const mstrRolesRows = mstrRoleIds.map(({
    id, code, isInternal, isDefault
  }) => ({
    id, code, isInternal, isDefault
  }))
  const mstrResourcesRows = mstrResourceIds.map(({
    id, code, name, isInternalDefault, isExternalDefault
  }) => ({
    id, code, name, isInternalDefault, isExternalDefault
  }))

  const data = []
  const externalRoleCodes = ['client', 'expert'];
  mstrRolesRows.forEach((role) => {
    mstrResourcesRows.forEach((resource) => {
      if (externalRoleCodes.indexOf(role.code) > -1) {
        if (resource.isExternalDefault) {
          data.push({
            mstrRoleId: role.id,
            mstrResourceId: resource.id,
            notes: 'autocreated'
          })
        }
      } else if (role.code === 'admin' || role.code === 'owner') {
        data.push({
          mstrRoleId: role.id,
          mstrResourceId: resource.id,
          notes: 'autocreated'
        })
      } else if (!(role.code === 'admin' || role.code === 'owner')) {
        if (resource.isInternalDefault) {
          data.push({
            mstrRoleId: role.id,
            mstrResourceId: resource.id,
            notes: 'autocreated'
          })
        }
      } else {
        data.push({
          mstrRoleId: role.id,
          mstrResourceId: resource.id,
          notes: 'autocreated'
        })
      }
    })
  })

  return data
}
const getExisting = async (queryInterface) => {
  const mstrRoleResources = await getRoleResources(queryInterface)
  const selection = await queryInterface.rawSelect('mstrRoleResources', {
    where: {
      [Op.or]: mstrRoleResources.map((d) => ({
        mstrRoleId: d.mstrRoleId,
        mstrResourceId: d.mstrResourceId,
        deletedAt: { [Op.is]: null }
      }))
    },
    plain: false
  }, ['id'])

  return selection
}

module.exports = {
  getRoleResources,
  getExisting,
  up: async (queryInterface, Sequelize) => {
    const existData = await getExisting(queryInterface)
    const mstrRoleResources = existData.length ? [] : await getRoleResources(queryInterface)

    return queryInterface.bulkInsert('mstrRoleResources', mstrRoleResources)
  },
  down: async (queryInterface, Sequelize) => {
    const data = await getRoleResources(queryInterface)

    return queryInterface.bulkDelete('mstrRoleResources', {
      [Op.or]: data.map((d) => ({
        mstrRoleId: d.mstrRoleId,
        mstrResourceId: d.mstrResourceId,
        deletedAt: { [Op.is]: null }
      }))
    })
  }
}
