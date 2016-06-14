'use strict';

const Joi = require('joi');
const utils = require('../../utils/utils');
const timeSeriesService = require('../services/time_series_service');


exports.register = function (server, options, next) {
  server.route({
    method: 'POST',
    path: '/history',
    config: {
      validate: {
        payload: {
          symbol: Joi.string().regex(/^[a-zA-Z]{1,4}$/).required(),
          duration: Joi.number().integer().min(1).optional()
        },
        failAction: utils.validationError
      }
    },
    handler: function (request, reply) {
      const req = {
        symbol: request.payload.symbol
      };
      const duration = request.payload.duration;
      if (duration) {
        req.duration = duration;
      }
      timeSeriesService.getTimeSeriesChart(req, function (err, data) {
        reply(err, data);
      });
    }
  });

  next();
};

exports.register.attributes = {
  name: 'history'
};