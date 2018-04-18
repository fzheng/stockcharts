'use strict';

const Hapi = require('hapi');
const Path = require('path');
const config = require('config');

const port = process.env.PORT || config.get('server.port');
const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, '../dist'),
      },
    },
  },
});

server.connection({
  host: config.get('server.host'),
  port,
});

server.register([
  {
    register: require('inert'),
  },
  {
    register: require('./routes/static.js'),
  },
  {
    register: require('./routes/history.js'),
  },
], (err) => {
  if (err) {
    throw err;
  }
});

server.start(() => {
  console.log(`Server starts at port: ${port}`);
});

module.exports = server;
