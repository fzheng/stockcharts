'use strict';

const request = require('request');
const config = require('../config');
const Memcached = require('memcached');

const memcached = new Memcached(config.memcached.location, config.memcached.options);

function getInputParams (symbol, duration) {
  if (!duration) {
    duration = config.services.time_series.default_duration;
  }
  return {
    Normalized: false,
    NumberOfDays: duration,
    DataPeriod: "Day",
    Elements: [
      {
        Symbol: symbol,
        Type: "price",
        Params: ["ohlc"]
      },
      {
        Symbol: symbol,
        Type: "volume"
      }
    ]
  };
}

function qetMemcached (symbol, cb) {
  memcached.get(symbol, cb);
}

function makeRequest (qsString, cb) {
  request({
    method: 'GET',
    url: config.services.time_series.url,
    qs: {
      parameters: qsString
    },
    json: true
  }, function (error, response, body) {
    if (response.statusCode === 200) {
      return cb(null, body);
    }
    const err = error || new Error('error: ' + response.statusCode);
    console.error(err);
    cb(err);
  });
}

function getTimeSeriesChart (req, cb) {
  const symbol = req.symbol;
  const duration = req.duration;
  qetMemcached(symbol, function (err, data) {
    if (data) {
      console.log("[Memcached] returns '" + symbol + "' historical data");
      return cb(null, data);
    }
    if (err) {
      console.error(err);
    }
    let qsString;
    try {
      qsString = JSON.stringify(getInputParams(symbol, duration));
    } catch (e) {
      console.error(e);
      cb(e);
    }
    makeRequest(qsString, function (reqError, reqData) {
      if (reqError) {
        return cb(reqError);
      }
      console.log("[Request] gets '" + symbol + "' historical data");
      memcached.set(symbol, reqData, config.memcached.expiration, function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log("[Memcached] sets '" + symbol + "' historical data");
        }
        cb(null, reqData); // won't output memcached error
      });
    });
  });
}

module.exports = {
  getTimeSeriesChart: getTimeSeriesChart
};