import loopback from 'loopback';
import boot from 'loopback-boot';

import express from 'express';
import bodyParser from 'body-parser';

import { ruleEngine } from '../rules';

const dbApp = loopback();

function startRuleEngineApp() {
  const ruleEngineApp = express();
  ruleEngineApp.use(bodyParser.json());
  ruleEngineApp.get('/', (req, res) => {
    res.send('Post data here to run rules.');
  });

  ruleEngine.loadRules().then(() => ruleEngineApp.post('/', async (req, res) => {
    const data = req.body;

    console.log('Receive POST data:\n');
    console.dir(data);

    ruleEngine.runRule(data).then(result => res.send(`Result is  ${JSON.stringify(result)}`));
  }));
  console.log('Send data to port 54088 to check data.');
  ruleEngineApp.listen(54088);
}

dbApp.start = function databaseAppStart() {
  // start the web server
  return dbApp.listen(() => {
    dbApp.emit('started');
    const baseUrl = dbApp.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);

    startRuleEngineApp();

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
