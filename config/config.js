var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
     root: rootPath,
    app: {
      name: 'appmap'
    },
    port: process.env.PORT,
    db: process.env.MONGODB_CON_STRING
  
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
    port: process.env.PORT,
    db: process.env.MONGODB_CON_STRING
  }
};

module.exports = config[env];
