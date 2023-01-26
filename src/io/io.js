/* eslint-disable class-methods-use-this */

const { Server } = require('socket.io');

const Namespace = require('./namespace');
const logger = require('../logging/createLogger')(__filename);
const { stringify } = require('../logging/format/common');
const { TYPE_INFO } = require('../../config/constants');

module.exports = class IO {
  /**
   * IO Constructor
   * @param {Object} manifest - app stack
   */
  constructor(manifest) {
    this.manifest = manifest;
  }

  createNamespace(manifest, name, events = []) {
    this.nsp[name] = new Namespace(manifest, this.io, { name, events });
    this.io._nsps.forEach((nsp) => {
      if (!this.nsp[nsp.name]) {
        nsp.server.use((socket, next) => this.showPacket(nsp, socket, next));
      }
    })
  }

  showPacket(nsp, socket, next) {
    socket.use((packet, more) => {
      logger.debug(stringify(
        TYPE_INFO.SOCKET_IO,
        {
          ns: nsp.name,
          packet,
          user: socket.iam
        }
      ))
      more();
    });

    next();
  }

  start() {
    // * make start separetely for JEST easy use
    this.options = this.manifest.config.io;

    this.io = new Server(this.manifest.server.http, this.options);
    this.nsp = {};

    (this.manifest.config.io.namespaces || []).forEach(name => {
      this.createNamespace(this.manifest, name)
    })
  }
}
