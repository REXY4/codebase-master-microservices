const Promise = require('bluebird');
const config = require('../../config');
const logger = require('../logging/createLoggerGrpc')(__filename);
const { stringify, objError } = require('../logging/format/common');
const grpcClient = require('../../utils/grpc-client');

const { grpc: { serviceOpts } } = config;
const { TYPE_INFO, TYPE_ERROR } = config.constants;

module.exports = class EnumerationGRPCClient {
  constructor() {
    this.module = {
      name: 'Enumeration', // Package name inside .proto
      service: 'EnumerationMethod', // Service name inside .proto
      proto: 'src/grpc/v1/proto/enumeration.proto',
      host: config.hosts.rpc.this
    }

    logger.info(stringify(TYPE_INFO.GRPC_CLIENT, {
      title: 'Load gRPC service',
      data: this.module
    }))

    this.method = Promise.promisifyAll(grpcClient(this.module, serviceOpts));
  }

  async create(data) {
    try {
      const response = await this.method.CreateEnumerationAsync(data);

      logger.info(stringify(TYPE_INFO.GRPC_CLIENT, {
        title: 'EnumerationMethod.CreateEnumeration',
        data: response
      }))

      return response
    } catch (err) {
      logger.error(stringify(TYPE_ERROR.GRPC_CLIENT, objError(err)));
      throw err;
    }
  }

  async getAll() {
    try {
      const response = this.method.GetEnumerationsAsync(null)

      logger.info(stringify(TYPE_INFO.GRPC_CLIENT, {
        title: 'EnumerationMethod.GetEnumerations',
        data: response
      }))

      return response
    } catch (err) {
      logger.error(stringify(TYPE_ERROR.GRPC_CLIENT, objError(err)));
      throw err;
    }
  }

  async getById(id) {
    try {
      const response = this.method.GetEnumerationByIdAsync({ id })

      logger.info(stringify(TYPE_INFO.GRPC_CLIENT, {
        title: 'EnumerationMethod.GetEnumerationById',
        data: response
      }))

      return response
    } catch (err) {
      logger.error(stringify(TYPE_ERROR.GRPC_CLIENT, objError(err)));
      throw err;
    }
  }
}
