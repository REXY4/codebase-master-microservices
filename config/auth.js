/* eslint-disable no-console */
require('dotenv').config()

const { join } = require('path')
const { existsSync, readFileSync } = require('fs')

const algorithm = 'RS256'
const dir = join(__dirname, '..', 'certificates');
const { env: parsed } = process

/** Private certificate used for signing JSON WebTokens */
const PRIVATE_KEY = parsed.PRIVATE_KEY || join(dir, 'private.key')
const SECRET = existsSync(PRIVATE_KEY) ? readFileSync(PRIVATE_KEY) : undefined;

/** Public certificate used for verification.  Note: you could also use the private key */
const PUBLIC_KEY = parsed.PUBLIC_KEY || join(dir, 'public.key')
const PUBLIC = existsSync(PUBLIC_KEY) ? readFileSync(PUBLIC_KEY) : undefined;

module.exports = {
  public: PUBLIC,
  secret: SECRET,
  algorithm,
  verifyOptions: { algorithms: [algorithm] }
}
