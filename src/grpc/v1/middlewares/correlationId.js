const correlator = require('../../../logging/correlationIdGrpc');

const correlationId = (ctx, next) => {
  correlator.bindEmitter(ctx.req);
  correlator.bindEmitter(ctx.res);
  correlator.withId(() => {
    const thisId = correlator.getId();
    ctx.res.set('x-correlation-id', thisId);
    next();
  }, ctx.req.get('x-correlation-id'));
};

module.exports = { correlationId };
