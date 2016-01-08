var config = {};

config.dbUri = 'mongodb://localhost/memoo';
config.sessionConfig = {
  secret: 'most secure session key',
  resave: true,
  saveUninitialized: true
};
config.rememberUserPeriod = 1000 * 3600 * 24 * 7; // 7 days
exports = module.exports = config;
