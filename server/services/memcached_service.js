'use strict';

const config = require('config');
const Memcached = require('memcached');

const memcached = new Memcached(config.get('memcached.location'), config.get('memcached.options'));


module.exports = {
  getCache(key, cb) {
    memcached.get(key, (err, data) => {
      if (err) {
        console.error(err);
        return cb(err);
      }
      if (data) {
        console.log(`[Memcached] returns data from key [${key}]`);
      }
      return cb(null, data);
    });
  },

  setCache(key, value, expiry, cb) {
    memcached.set(key, value, expiry, (err) => {
      if (err) {
        console.error(err);
        return cb(err);
      }
      console.log(`[Memcached] sets data into key [${key}]`);
      return cb();
    });
  },
};
