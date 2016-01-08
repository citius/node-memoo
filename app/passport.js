var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var RememberMeStrategy = require('passport-remember-me').Strategy;

module.exports = function (app) {
  "use strict";
  var passport = app.get('passport');
  
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    mongoose.model('User').findById(id, done);
  });

  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    function (email, password, done) {
      mongoose.model('User').findOne({email: email}, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {message: 'Incorrect email.'});
        }
        if (!user.isValidPassword(password)) {
          return done(null, false, {message: 'Incorrect password.'});
        }
        return done(null, user);
      });
    }
  ));
  
  passport.use(new RememberMeStrategy(
    function (token, done) {
      mongoose.model('User').Token.consume(token, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      });
    },
    function (user, done) {
      mongoose.model('User').Token.update(user, function (err) {
        if (err) {
          return done(err);
        }
        return done(null, token);
      });
    }
  ));
};
