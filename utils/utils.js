'use strict';

module.exports = {
  validationError: function (request, reply, source, error) {
    return reply(error);
  }
};