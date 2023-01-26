const _ = require('lodash');
const { ReasonPhrases, StatusCodes } = require('http-status-codes')

const { constants: { TYPE_ERROR } } = require('../../../../config');
const logger = require('../../../logging/createLogger')(__filename);
const { stringify, objError, newError } = require('../../../logging/format/common');

const findMatchRoute = (req) => {
  let route;
  let pathName = req._parsedUrl.pathname.split('/')
  if (Object.entries(req.params).length) {
    const params = Object.entries(req.params).map((el) => {
      el[2] = false;
      return el
    })
    pathName = pathName.map((pathVal, i, arr) => {
      const entry = params.filter(([p, value, used]) => value === pathVal && used === false)[0]
      if (entry) {
        entry[2] = true;
        return `:${entry[0]}`
      }
      return pathVal
    })
  }
  const baseRoute = Object.values(req.manifest.server.routes).filter((el) => el.basePath === req.baseUrl)
  if (baseRoute[0]) {
    const routes = baseRoute[0].routes.filter(el => el.path === pathName.join('/') && el.method === req.method.toLowerCase())
    if (routes[0]) {
      // eslint-disable-next-line prefer-destructuring
      route = routes[0]
      route.scopes = route.scopes.map(scope => {
        if (scope.indexOf(req.manifest.config.enums.app.beMaster) === 0) return scope;
        return `${req.manifest.config.enums.app.beMaster}:${scope}`
      })
    }
  }
  return route;
}

module.exports = async function (req, res, next) {
  try {
    req.thisRoute = findMatchRoute(req);
    if (!req.thisRoute) return next()

    const resourceRoles = req.manifest.config.resources.filter((resource) => req.thisRoute.scopes.indexOf(resource.key) > -1);
    if (!resourceRoles.length) return next()

    const allowedRoles = _.uniq(
      _.flatten(
        resourceRoles.map((resourceRole) => resourceRole.value.roles.map((role) => role.key))
      )
    )
    const intersect = _.intersection(allowedRoles, req.logged.roles)
    if (!intersect.length) throw newError('accessProhibited', req.language)

    return next()
  } catch (err) {
    if (err.isCustom) {
      logger.error(stringify(TYPE_ERROR.AUTHORIZATION, objError(err)))

      return res.status(StatusCodes.FORBIDDEN).send({
        code: StatusCodes.FORBIDDEN,
        status: ReasonPhrases.FORBIDDEN,
        messages: [
          { code: err.code, message: err.message }
        ]
      })
    }

    return next(err)
  }
};
