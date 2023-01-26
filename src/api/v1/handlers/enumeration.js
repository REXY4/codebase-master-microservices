const qsToSQL = require('../../../../utils/qs-to-sql');
const logger = require('../../../logging/createLogger')(__filename);
const { stringify, objError } = require('../../../logging/format/common');
const { v1: { Enumeration: EnumerationService } } = require('../../../services');

const create = async (req, res, next) => {
  try {
    const enumerationService = new EnumerationService(req.manifest)
    const result = await enumerationService.create(req.body, null, req.logged.accountId);

    return res.send({
      code: 200,
      status: 'OK',
      data: [
        { ...result.dataValues }
      ]
    });
  } catch (e) {
    return next(e)
  }
};

const getOneBy = async (req, res, next) => {
  try {
    const enumerationService = new EnumerationService(req.manifest)
    const options = {
      where: { id: req.params.id },
      count: true
    }
    const result = await enumerationService.getBy(options);

    return res.send({
      code: 200,
      status: 'OK',
      data: result
    });
  } catch (e) {
    return next(e)
  }
};

const getBy = async (req, res, next) => {
  try {
    const enumerationService = new EnumerationService(req.manifest)
    const options = {
      ...qsToSQL.build(req.query),
      count: true
    }
    const result = await enumerationService.getBy(options);
    return res.send({
      code: 200,
      status: 'OK',
      data: result
    });
  } catch (e) {
    return next(e)
  }
};

const deleteOneBy = async (req, res, next) => {
  try {
    const enumerationService = new EnumerationService(req.manifest)
    const options = {
      where: { id: req.params.id }
    }
    const result = await enumerationService.deleteBy(options, req.logged.accountId);

    return res.send({
      code: 200,
      status: 'OK',
      data: result
    });
  } catch (e) {
    return next(e)
  }
};

const updateOneBy = async (req, res, next) => {
  try {
    const enumerationService = new EnumerationService(req.manifest)
    const options = {
      where: { id: req.params.id }
    }
    const result = await enumerationService.updateBy(req.body, options, req.logged.accountId);

    return res.send({
      code: 200,
      status: 'OK',
      data: result
    });
  } catch (e) {
    return next(e)
  }
};

module.exports = {
  create,
  getOneBy,
  getBy,
  deleteOneBy,
  updateOneBy
};
