const relation = require('../../../../logging/correlationId');

module.exports = function correlationId(req, res, next) {
  relation.bindEmitter(req);
  relation.bindEmitter(res);
  relation.bindEmitter(req.socket);

  relation.withId(() => {
    const currentCorrelationId = relation.getId();
    res.set('x-correlation-id', currentCorrelationId);
    next();
  }, req.get('x-correlation-id'));
};
