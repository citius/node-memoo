'use strict';

var crypto = require('crypto');
var mongoose = require('mongoose');
var debug = require('debug')('memoo:user:token');

module.exports = {
  consume: (token, cb) => {
    mongoose.model('User').findOne({token: token}, function (err, user) {
      if (err) return cb(err);
      User.update({token: token}, {$unset: {token: 0}}, {}, function (err) {
        return cb(err, user);
      });
    });
  },

  update: (user, cb) => {
    mongoose.model('User').findById(user._id, function (err, user) {
      if (err) return cb(err);
      if (!user) return cb(null, null);

      user.token = crypto
        .createHash('sha1')
        .update((new Date()).valueOf().toString() + Math.random().toString() + user._id)
        .digest('hex');
      user.save(function (err) {
        cb(err, user.token);
      });
    });
  }
};
