let sequelize
const { Op, Sequelize } = require('sequelize')

// eslint-disable-next-line no-unused-vars
function getRelations() {
  return [
    { model: sequelize.models.tableOne, as: 't1' },
    { model: sequelize.models.tableTwo, as: 't2' }
  ]
}

async function create(data, options = {}, writer = null) {
  return sequelize.models.mstrEnumerations.create(
    {
      createdBy: writer || 'SYSTEM',
      createdAt: await sequelize.getDatetime({
        ...{ transaction: options ? options.transaction : null },
      }),
      ...data
    },
    sequelize.constructOptions(options, false)
  )
}

async function getBy(options = {}) {
  const count = options.count || false
  const opts = {
    ...options,
    // include: getRelations(), // if you need some relation, open this comment
    where: {
      ...options.where,
      deletedAt: { [Op.is]: null }
    }
  }
  const parameters = sequelize.constructOptions(opts)
  if (count) return sequelize.models.mstrEnumerations.findAndCountAll(parameters)

  return sequelize.models.mstrEnumerations.findAll(parameters)
}

async function deleteBy(options = {}, writer = null) {
  const opts = {
    ...options,
    where: {
      ...options.where,
      deletedAt: { [Op.is]: null }
    },
    returning: true
  }
  const [count, rows] = await sequelize.models.mstrEnumerations.update(
    {
      deletedBy: writer || 'SYSTEM',
      deletedAt: await sequelize.getDatetime({
        ...{ transaction: options ? options.transaction : null },
      })
    },
    sequelize.constructOptions(opts, false)
  )

  return { count, rows }
}

async function updateBy(data, options = {}, writer = null) {
  const opts = {
    ...options,
    where: {
      ...options.where,
      deletedAt: { [Op.is]: null }
    },
    returning: true
  }
  const [count, rows] = await sequelize.models.mstrEnumerations.update(
    {
      updatedBy: writer || 'SYSTEM',
      updatedAt: await sequelize.getDatetime({
        ...{ transaction: options ? options.transaction : null },
      }),
      ...data
    },
    sequelize.constructOptions(opts, false)
  )

  return { count, rows }
}

const registers = {
  create, getBy, updateBy, deleteBy
}

exports.default = connection => {
  sequelize = connection
  return registers
}

Object.values(registers).forEach(method => {
  exports[method.name] = async function (...args) {
    const [connection] = args;
    sequelize = connection
    return method(...args.slice(1))
  }
})
