const logger = require('./src/logging/createLogger')(__filename);
const { stringify, objError } = require('./src/logging/format/common');
const { TYPE_ERROR } = require('./config').constants;
const Manifest = require('./src/manifest');

const start = async () => {
  const manifest = new Manifest()

  await manifest.setup();
  manifest.start();
}

/** Caught all unhandled rejected promise exceptions */
process.on('unhandledRejection', (error) => {
  throw error;
});

/** Caught all unhandled non-promise exceptions */
process.on('uncaughtException', (error) => {
  logger.error(stringify(TYPE_ERROR.UNCAUGHT, objError(error)));
  process.exit(1);
});

start();
