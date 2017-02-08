import Promise from 'bluebird';
import { Engine } from 'json-rules-engine';
import fetch from 'node-fetch';

import express from 'express';
import bodyParser from 'body-parser';

function parseJSON(response) {
  return response.json().catch(error => Promise.reject(new Error(error)));
}

function loadRules(anEngine) {
  return fetch('http://localhost:3000/api/rules?access_token=qwer').then(parseJSON).then((dataList) => {
    console.log('Using rules: ');
    console.dir(dataList);
    return dataList;
  }).then(dataList => dataList.map(data => anEngine.addRule(data.rule)));
}

function runRule(facts, anEngine) {
  return anEngine.run(facts).then(events =>
  // run() returns events with truthy conditions
  events.map(event => event.params.message));
}

let ruleEngineApp = null;
let engine = new Engine();

export default function startRuleEngineApp() {
  ruleEngineApp = express();
  ruleEngineApp.use(bodyParser.json());
  ruleEngineApp.get('/', (req, res) => {
    res.send('Post data here to run rules.');
  });

  loadRules(engine).then(() => ruleEngineApp.post('/', async (req, res) => {
    const data = req.body;

    console.log('Receive POST data:\n');
    console.dir(data);

    runRule(data, engine).then(result => res.send(`Result is  ${JSON.stringify(result)}`));
  }));
  console.log('Send data to port 54088 to check data.');
  ruleEngineApp.listen(54088);
}

export function restartRuleEngine() {
  console.log('Rule Engine restarted.');
  engine = new Engine();
  loadRules(engine);
}
