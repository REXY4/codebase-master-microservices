const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const { TYPE_INFO, MESSAGE } = require('../config/constants');
const logger = require('./logging/createLogger')(__filename);
const { stringify } = require('./logging/format/common');
const middlewares = require('./api/v1/middlewares');

const {
  decorator,
  tracker: {
    reqLogging: { httpLog },
    correlationId
  },
  language
} = middlewares;

module.exports = class API {
  /**
   * App Constructor
   * @param {Object} options - required parameters to run the app
   */
  constructor(options, manifest) {
    const { svc } = manifest.config.hosts;

    Object.assign(this, options);

    this.app = express();
    this.app.use(decorator('manifest', manifest));
    this.app.use(express.static('dist'));

    if (this.corsOptions) {
      this.app.use(cors());
      this.app.options('*', cors());
    }

    if (this.docs) {
      const jsonUrl = `${svc.this}/swagger.json`;
      this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(this.docs, {
        explorer: true,
        swaggerOptions: {
          validatorUrl: null,
          url: jsonUrl,
          spec: jsonUrl,
        },
        customCssUrl: `${svc.this}/libs/swagger/3.x/theme-material.css`,
        customJs: `${svc.this}/docs.js`
      }));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(language);
    this.app.use(correlationId);
    this.app.use(httpLog);

    if (this.routes && this.routes.length !== 0) {
      Object.values(this.routes).forEach(definition => {
        const router = express.Router()
        definition.routes.forEach(route => {
          router[route.method](
            ...[route.path].concat(route.action)
          )
        })
        this.app.use(definition.basePath, router)
      })
    }

    // * views
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, 'pages'))
    this.app.get('/chat', (req, res) => res.render('chat'));

    // * for default error fallback
    this.app.use(middlewares.error);
  }

  start() {
    // * make start separetely for JEST easy use
    const port = this.config.PORT;
    this.http = this.app.listen(port, () => logger.info(stringify(
      TYPE_INFO.SYSTEM,
      `${MESSAGE.HTTP_LISTENED} ${port}...`
    )));
  }
}
