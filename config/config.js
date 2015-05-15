var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

//var urldb = 'mongodb://127.0.0.1/appmap-development';
var urldb = 'mongodb://localhost/appmap-development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'appmap'
    },
    port: 27017,
    db: urldb
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
    port: 27017,
    db: 'mongodb://127.0.0.1/appmap-development'
  }
};

module.exports = config[env];
