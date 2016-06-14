'use strict';

module.exports = {
  "server": {
    "host": "0.0.0.0",
    "port": "3000"
  },
  "memcached": {
    "location": "0.0.0.0:11211",
    "options": {},
    "expiry": {
      "history": 28800,
      "lookup": 0
    }
  },
  "services": {
    "time_series": {
      "url": "http://dev.markitondemand.com/Api/v2/InteractiveChart/json",
      "default_duration": 3650
    },
    "lookup": {
      "url": "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json"
    }
  }
};