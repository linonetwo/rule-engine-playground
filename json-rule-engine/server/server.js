const loopback = require('loopback');
const boot = require('loopback-boot');

const ruleEngine = require('../rules').default;

const dbApp = loopback();

dbApp.start = function databaseAppStart() {
  // start the web server
  return dbApp.listen(() => {
    dbApp.emit('started');
    const baseUrl = dbApp.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);

    ruleEngine();

    if (dbApp.get('loopback-component-explorer')) {
      const explorerPath = dbApp.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(dbApp, __dirname, (err) => {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) { dbApp.start(); }
});

module.exports = dbApp;
