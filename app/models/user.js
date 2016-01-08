var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');
var Token = require('./user/token');
var unique = require('../../libs/mongo-unique');
var Schema = mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  lastLogin: {type: Date, default: Date.now},
  login: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String }
});

Schema.path('email').validate(unique('email', 'users'), 'Такой email уже зарегестрирован.');

Schema.pre('save', function (next) {
  if (this.isNew) {
    this.password = this.model('User').createHash(this.password);
  }
  next();
});

Schema.statics.Token = Token;

Schema.statics.createHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

Schema.statics.checkEmail = function (email, cb) {
  this.count({email: email}, (err, count) => {
    cb(err, !!count);
  });
};

Schema.methods.isValidPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', Schema);
