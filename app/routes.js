var routes = require('./routes/index');
var users = require('./routes/users');

module.exports = function (app) {
  "use strict";
  app.use('/', routes);
  app.use('/users', users);
};
