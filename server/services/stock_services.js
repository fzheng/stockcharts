'use strict';

const request = require('request');
const config = require('config');
const memcachedService = require('./memcached_service');


function makeHttpRequest(url, qs, cb) {
  request({
    method: 'GET',
    url,
    qs,
    json: true,
  }, (error, response, body) => {
    if (response.statusCode === 200) {
      return cb(null, body);
    }
    const err = error || new Error(`error: ${response.statusCode}`);
    console.error(err);
    cb(err);
  });
}

function getTimeSeriesChart(req, cb) {
  const symbol = req.symbol;
  let duration = req.duration;
  const memcachedKey = `${symbol}:history`;

  memcachedService.getCache(memcachedKey, (err, data) => {
    if (data) {
      return cb(null, data);
    }

    let qsString;
    try {
      if (!duration) {
        duration = config.get('services.time_series.default_duration');
      }
      qsString = JSON.stringify({
        Normalized: false,
        NumberOfDays: duration,
        DataPeriod: 'Day',
        Elements: [
          {
            Symbol: symbol,
            Type: 'price',
            Params: ['ohlc'],
          },
          {
            Symbol: symbol,
            Type: 'volume',
          },
        ],
      });
    } catch (e) {
      console.error(e);
      return cb(e);
    }

    makeHttpRequest(config.get('services.time_series.url'), { parameters: qsString }, (reqError, reqData) => {
      if (reqError) {
        return cb(reqError);
      }
      console.log(`[Request] gets '${symbol}' historical data`);
      memcachedService.setCache(memcachedKey, reqData, config.get('memcached.expiry.history'), () => {
        cb(null, reqData); // won't output memcached error
      });
    });
  });
}

function getAutoSuggestion(req, cb) {
  const input = req.input;
  const memcachedKey = `${input}:lookup`;

  memcachedService.getCache(memcachedKey, (err, data) => {
    if (data) {
      return cb(null, data);
    }

    makeHttpRequest(config.get('services.lookup.url'), { input }, (reqError, reqData) => {
      if (reqError) {
        return cb(reqError);
      }
      console.log(`[Request] gets '${input}' autosuggestion`);
      memcachedService.setCache(memcachedKey, reqData, config.get('memcached.expiry.lookup'), (err) => {
        cb(null, reqData);
      });
    });
  });
}

module.exports = {
  getTimeSeriesChart,
  getAutoSuggestion,
};
