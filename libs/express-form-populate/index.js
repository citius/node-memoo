module.exports = function () {
  return function (req, res, next) {
    if ((req.header('content-type') == 'application/x-www-form-urlencoded'
      || req.header('content-type') == 'multipart/form-data')
      && req.body) {
      res.locals.form = function (attribute) {
        if (!body) return null;
        return body[attribute] ? body[attribute] : null;
      };
    }
    
    return next();
  }
};
