const {
  Op
} = require('sequelize')
const paginate = require('./paginate')

function build(query) {
  const {
    search = {}, page, pageSize, sort = [], filters = {}
  } = query

  const sorting = sort ? sort[0] === '[' && sort[sort.length - 1] === ']' ? sort : '[]' : '[]'
  const { limit, offset } = paginate({ page: page || 1, pageSize: pageSize || 5 })
  const parameter = {
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: JSON.parse(sorting),
    where: {}
  }

  if (Object.keys(filters).length) {
    parameter.where = {
      [Object.keys(filters)[0]]: Object.values(filters)[0]
    }
  }

  if (Object.keys(search).length && search.fields && search.value) {
    if (!Array.isArray(search.fields)) {
      search.fields = [search.fields]
    }
    search.fields.forEach(key => {
      parameter.where = {
        ...parameter.where,
        [key]: {
          [Op.iLike]: `%${search.value.toLowerCase()}%`
        }
      }
    });
  }

  if (!Object.keys(parameter.where).length) {
    delete parameter.where
  } else {
    parameter.where = {
      [Op.or]: parameter.where
    }
  }

  if (!parameter.order.length) delete parameter.order
  if (!parameter.offset) delete parameter.offset

  return parameter
}

module.exports = { build }
