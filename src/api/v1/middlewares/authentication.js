const _ = require('lodash');
const { ReasonPhrases, StatusCodes } = require('http-status-codes')

const { hosts, constants: { TYPE_ERROR }, message: Err } = require('../../../../config');
const { decode } = require('../../../../utils/token');
const logger = require('../../../logging/createLogger')(__filename);
const { stringify, objError, newError } = require('../../../logging/format/common');

module.exports = async (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const tokens = authorization.split(/\s/g)
  const token = tokens[tokens.length === 1 ? 0 : 1]
  try {
    const decoded = await decode(token);
    const isLoggedOut = await req.manifest.redis.get(token);
    if (isLoggedOut) throw newError('invalidSession', req.language)
    if (hosts.svc.oauth !== decoded.iss) throw newError('invalidIssuer', req.language)

    const { profile, roles } = decoded
    if (!profile.accountId) throw newError('invalidIdentity', req.language)

    req.logged = { ...profile, roles: _.uniq(roles) };
    return next()
  } catch (err) {
    if (err.isCustom || err.message === 'jwt expired') {
      logger.error(stringify(TYPE_ERROR.AUTHENTICATION, objError(err)))

      return res.status(StatusCodes.UNAUTHORIZED).send({
        code: StatusCodes.UNAUTHORIZED,
        status: ReasonPhrases.UNAUTHORIZED,
        messages: [
          { code: err.code, message: err.message }
        ]
      })
    }

    return next(err)
  }
};
