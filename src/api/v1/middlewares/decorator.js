module.exports = (decorator, value) => ((req, res, next) => {
  req[decorator] = value
  return next();
});
