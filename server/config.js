'use strict';

module.exports = {
  "server": {
    "host": "0.0.0.0",
    "port": "3000"
  },
  "services": {
    "time_series": {
      "url": "http://dev.markitondemand.com/Api/v2/InteractiveChart/json",
      "default_duration": 36500
    }
  }
};