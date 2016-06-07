'use strict';

exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.file('index.html');
    }
  });

  server.route({
    method: 'GET',
    path: '/app.js',
    handler: function (request, reply) {
      reply.file('app.js');
    }
  });

  server.route({
    method: 'GET',
    path: '/app.css',
    handler: function (request, reply) {
      reply.file('app.css');
    }
  });

  next();
};

exports.register.attributes = {
  name: 'static'
};