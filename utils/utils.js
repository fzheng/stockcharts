'use strict';

exports.validationError = function (request, reply, source, error) {
  return reply(error);
};