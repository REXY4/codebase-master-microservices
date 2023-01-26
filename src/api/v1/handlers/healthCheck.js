const { v1: { HealthCheck: HealthCheckService } } = require('../../../services');

const checkAll = async (req, res, next) => {
  try {
    const healthCheckService = new HealthCheckService(req.manifest)
    const result = await healthCheckService.checkAll();

    return res.send({
      code: 200,
      status: 'OK',
      data: result
    });
  } catch (e) {
    return next()
  }
};

module.exports = { checkAll };
