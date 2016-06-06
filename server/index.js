'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const config = require('./config');
const port = process.env.PORT || config.server.port;

server.connection({
  host: config.server.host,
  port: port
});

server.register([
  {
    register: require('./routes/history.js')
  }
], function (err) {
  if (err) {
    throw err;
  }
});

server.start(function () {
  console.log('Server Starts at port: ' + port);
});

module.exports = server;