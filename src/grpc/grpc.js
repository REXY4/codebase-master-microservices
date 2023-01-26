const Mali = require('mali');

const { constants: { TYPE_INFO, TYPE_ERROR, MESSAGE }, grpc } = require('../../config');
const logger = require('../logging/createLoggerGrpc')(__filename);
const { stringify, objError } = require('../logging/format/common');
const modules = require('./v1/modules');

module.exports = class GRPC {
  constructor(manifest) {
    const me = this;

    me.manifest = manifest;
    me.app = new Mali();

    Object.values(modules).forEach(mod => {
      me.app.addService(mod.proto, mod.service, grpc.serviceOpts);

      mod.handlers.forEach((handler) => {
        const middlewares = handler.middlewares || [];
        const actions = [
          mod.service,
          handler.method.name,
          ...middlewares,
          handler.method
        ]
        me.app.use(...actions)
      })
    })

    me.app.on('error', (error) => {
      if (!error.code) {
        logger.error(stringify(TYPE_ERROR.GRPC, objError(error)));
      }
    });
  }

  start() {
    const { port } = grpc

    this.app.manifest = this.manifest;
    this.app.start(`0.0.0.0:${port}`);

    logger.info(stringify(
      TYPE_INFO.SYSTEM,
      `${MESSAGE.GRPC_LISTENED} ${port}...`
    ));
  }
}
