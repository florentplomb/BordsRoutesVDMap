var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'appmap'
    },
    port: 3000,
    db: 'mongodb://localhost/appmap-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'appmap'
    },
    port: 3000,
    db: 'mongodb://localhost/appmap-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'appmap'
    },
    port: 3000,
    db: 'mongodb://localhost/appmap-production'
  }
};

module.exports = config[env];
