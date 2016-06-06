'use strict';

const request = require('request');
const config = require('../config');

function getInputParams (symbol, duration) {
  if (duration === undefined) {
    duration = config.services.time_series.default_duration;
  }
  symbol = symbol.toUpperCase();
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

function makeRequest (req, cb) {
  const symbol = req.symbol;
  const duration = req.duration;
  let qsString;
  try {
    qsString = JSON.stringify(getInputParams(symbol, duration));
  } catch (e) {
    console.error(e);
    cb(e);
  }
  request({
    method: 'GET',
    url: config.services.time_series.url,
    qs: {
      parameters: qsString
    },
    json: true
  }, function (error, response, body) {
    if (response.statusCode === 200) {
      cb(null, body);
    } else {
      const err = error || new Error('error: ' + response.statusCode);
      console.error(err);
      cb(err);
    }
  });
}

module.exports = {
  makeRequest: makeRequest
};