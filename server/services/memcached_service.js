'use strict';

const config = require('../config');
const Memcached = require('memcached');
const memcached = new Memcached(config.memcached.location, config.memcached.options);


module.exports = {
  getCache: function (key, cb) {
    memcached.get(key, function (err, data) {
      if (err) {
        console.error(err);
        return cb(err);
      }
      if (data) {
        console.log("[Memcached] returns data from key [" + key + "]");
      }
      return cb(null, data);
    });
  },

  setCache: function (key, value, expiry, cb) {
    memcached.set(key, value, expiry, function (err) {
      if (err) {
        console.error(err);
        return cb(err);
      }
      console.log("[Memcached] sets data into key [" + key + "]");
      return cb();
    });
  }
};