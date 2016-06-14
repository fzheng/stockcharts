'use strict';

const request = require('request');
const config = require('../config');
const memcachedService = require('./memcached_service');


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
  const memcachedKey = symbol + ':history';

  memcachedService.getCache(memcachedKey, function (err, data) {
    if (data) {
      return cb(null, data);
    }
    let qsString;
    try {
      qsString = JSON.stringify(getInputParams(symbol, duration));
    } catch (e) {
      console.error(e);
      return cb(e);
    }
    makeRequest(qsString, function (reqError, reqData) {
      if (reqError) {
        return cb(reqError);
      }
      console.log("[Request] gets '" + symbol + "' historical data");
      memcachedService.setCache(memcachedKey, reqData, config.memcached.expiry.history, function (err) {
        cb(null, reqData); // won't output memcached error
      });
    });
  });
}

module.exports = {
  getTimeSeriesChart: getTimeSeriesChart
};