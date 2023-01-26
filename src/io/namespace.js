/* eslint-disable class-methods-use-this */

const { unauthorized } = require('./emitters');
const listeners = require('./listeners');
const { decode } = require('../../utils/token');

const logger = require('../logging/createLogger')(__filename);
const { stringify } = require('../logging/format/common');
const { TYPE_INFO } = require('../../config/constants');

class Namespace {
  /**
   * Namespace constructor
   * @param {Object} options - required parameters to run the io
   */
  constructor(manifest, io, { name = '', events = [] }) {
    this.data = {};
    this.name = `/${name}`;
    this.ns = io.of(this.name)

    if (!events.length) events = Object.keys(listeners);

    events = events.map(ev => (typeof listeners[ev] === 'function' ? listeners[ev](manifest) : listeners[ev]))

    logger.info(stringify(TYPE_INFO.SOCKET_IO, {
      message: `Init events listeners to namespace=${this.name}`,
      data: events.map((e) => e.name)
    }));

    this.ns.use((socket, next) => this.authorization(socket, next))
    this.ns.on('connection', (socket) => this.onConnect(socket, events))
  }

  tokenVerification(str) {
    const token = decode(str.replace(/(b|B)earer\s/, ''))

    if (Date.now() >= str.exp * 1000) {
      return new Error('Token expired');
    }

    return token
  }

  onConnect(socket, events) {
    const me = this;
    events.forEach((event) => {
      const { name, active, handler } = event;

      if (active && handler) socket.on(name, handler(me.data))
    });
  }

  authorization(socket, next) {
    const me = this
    socket.use(async (packet, more) => {
      const { headers = {}, query = {}, auth = {} } = socket.handshake;
      const { authorization } = headers;
      const { token } = query;
      const { key } = auth;
      const jwt = authorization || token || key;

      try {
        const decoded = await me.tokenVerification(jwt);
        socket.iam = decoded;
        more();
      } catch (e) {
        socket.emit(unauthorized.name, e);
      }
    });

    next()
  }
}

module.exports = Namespace
