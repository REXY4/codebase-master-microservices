const name = 'Enumeration';
const service = 'EnumerationMethod';
const proto = require('path').resolve(`${__dirname}/../proto/enumeration.proto`);

const { authentication } = require('../middlewares')
const EnumerationService = require('../../../services/v1/enumeration');

const CreateEnumeration = async (ctx, next) => {
  try {
    const enumerationService = new EnumerationService(ctx.app.manifest)
    const { key, value, notes } = ctx.req;
    const payload = { key, value, notes };

    const row = await enumerationService.create(payload, null, ctx.app.manifest.config.app.name);

    ctx.res = {
      rows: [
        {
          id: row.id,
          key: row.key,
          value: row.value,
          notes: row.notes,
        }
      ]
    };
  } catch (err) {
    throw new Error(err);
  }
};

const GetEnumerations = async (ctx, next) => {
  try {
    const enumerationService = new EnumerationService(ctx.app.manifest)
    const data = await enumerationService.getBy({
      count: true,
      limit: -1
    });
    const rows = data.rows.map(row => ({
      id: row.id,
      key: row.key,
      value: row.value,
      notes: row.notes,
    }))
    ctx.res = { rows };
  } catch (err) {
    throw new Error(err);
  }
};

const GetEnumerationById = async (ctx, next) => {
  const enumerationService = new EnumerationService(ctx.app.manifest)
  try {
    const { id: _id } = ctx.req;
    const rows = await enumerationService.getBy({
      where: { id: _id }
    });

    // eslint-disable-next-line object-curly-newline
    ctx.res = { rows: rows.map(({ id, key, value, notes }) => ({ id, key, value, notes })) };
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  name,
  proto,
  service,
  handlers: [
    { method: CreateEnumeration, middlewares: [authentication] },
    { method: GetEnumerations },
    { method: GetEnumerationById }
  ]
};
