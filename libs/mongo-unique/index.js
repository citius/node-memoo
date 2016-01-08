var debug = require('debug')('boca:unique');
var mongoose = require('mongoose');

exports = module.exports = function (propName, collectionName) {
  return function (value, respond) {
    if (!this.isNew) {
      return respond(true);
    }

    var query = {};

    query[propName] = value;
    mongoose.connection.collection(collectionName).findOne(query, function(err, doc) {
      if (err) {
        debug(err);
      } else {
        return respond(!doc);
      }
    });
  }
};