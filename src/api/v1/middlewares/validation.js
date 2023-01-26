const _ = require('lodash')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')

module.exports = (joiSchema, key) => (req, res, next) => {
  try {
    const data = {
      ...Array.from(joiSchema._ids._byKey.keys()).reduce((a, v) => ({ ...a, [v]: req[key][v] }), {})
    };
    const validate = joiSchema.validate(data)

    if (validate.error) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        code: StatusCodes.BAD_REQUEST,
        status: ReasonPhrases.BAD_REQUEST,
        messages: validate.error.details.map((err, i) => ({
          code: `${_.capitalize(key)}Validation${i + 1}`,
          message: err.message
        }))
      })
    }

    return next()
  } catch (e) {
    return next(e)
  }
}
