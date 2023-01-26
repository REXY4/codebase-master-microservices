const fs = require('fs')
const { convert } = require('joi-route-to-swagger')
const { faker } = require('@faker-js/faker');

const logger = require('./logging/createLogger')(__filename);
const { stringify } = require('./logging/format/common');
const config = require('../config');
const enumerationSubscriber = require('./subscribers/enumeration');

const { TYPE_ERROR, MESSAGE } = config.constants;

module.exports = class Manifest {
  constructor() {
    this.config = config;
  }

  async setup() {
    await this.setRedis()
    await this.setSQL()
    await this.setMongoDB()
    await this.setRabbitMQ()
    await this.setServer()
    await this.setGRPC()
    await this.setIO()
    await this.setCron()
  }

  start() {
    this.server.start();
    this.grpc.start();
    this.io.start();
    this.cron.jobTest();
  }

  async setRedis() {
    this.redis = await require('./redis')(config.redis)
  }

  async setSQL() {
    this.sql = await require('./sql-model')(this.config.sql)
    this.sql.repo = require('./sql-repo')(this.sql.sequelize)

    // /** Alternative way */
    // const { sequelize, model } = await require('./sql-model')(config.sql)
    // const sqlRepo = require('./sql-repo/all')
    // const enumRows = await sqlRepo.enumeration.getBy(sequelize, {})
    // console.log(enumRows)
  }

  async setMongoDB() {
    this.mongo = await require('./mongo-model')(this.config.mongo)
    this.mongo.repo = require('./mongo-repo')(this.mongo.mongoose)

    // /** Alternative way */
    // const { mongoose, model } = await require('./mongo-model')(this.config.mongo)
    // const mongoRepo = require('./mongo-repo/all')
    // const topicRows = await mongoRepo.topic.getOneBy(mongoose, {})
    // console.log(topicRows)
  }

  async setRabbitMQ() {
    const { Client } = require('./rabbitmq');
    this.rmq = new Client(this.config.rabbitmq)

    const channelId = `ch:${this.config.app.name}:${faker.word.adjective()}`
    const channel = await this.rmq.confirmChannel(channelId);

    channel.listeners('return').map(fn => channel.removeListener('return', fn))
    channel.on('return', ({ fields, content }) => {
      const data = { fields, content: JSON.parse(content) }
      logger.error(
        stringify(
          TYPE_ERROR.RABBIT_MQ,
          `${MESSAGE.RABBITMQ_PUBLISH_FALLBACK} (${channel._id}): Failed to publish`,
          data
        )
      )
    })

     // * reusable channel
    this.rmq.channel = channel;

    // * register subscription (for internal subscription; skip when NODE_ENV is test)
    if (this.config.env !== 'test') {
      enumerationSubscriber(this);
    }
  }

  async setServer() {
    const allowedOrigins = ['*'];
    const corsOptions = {
      origin(origin, callback) {
        if (!origin) {
          /* Allow requests with no origin (like mobile apps or curl requests) */
          return callback(null, true);
        }

        if (!allowedOrigins.includes(origin)) {
          const message = 'The CORS policy for this site does not allow access from the specified origin.';
          return callback(new Error(message), false);
        }

        return callback(null, true);
      },
      optionsSuccessStatus: 200
    };

    const apiRoutes = require('./api/v1/routes');
    Object.values(apiRoutes).forEach(el => {
      el.routes = el.routes.filter(route => route.enabled !== false)
    })

    const { DOCS_DEF, ROUTE_DEF } = require('./api/v1/docs');
    const swaggerDocs = convert(Object.values(apiRoutes), DOCS_DEF, ROUTE_DEF)

    if (!fs.existsSync('dist')) fs.mkdirSync('dist');
    fs.writeFileSync('dist/swagger.json', JSON.stringify(swaggerDocs, 0, 2))

    const Server = require('./server');
    this.server = new Server({
      config: { PORT: this.config.app.port },
      corsOptions,
      docs: swaggerDocs,
      routes: apiRoutes
    }, this);
  }

  async setIO() {
    const IO = require('./io/io');
    this.io = new IO(this)
  }

  async setGRPC() {
    const GRPC = require('./grpc/grpc');
    this.grpc = new GRPC(this);
  }

  async setCron() {
    const Cron = require('./cron');
    this.cron = new Cron(this);
  }
}
