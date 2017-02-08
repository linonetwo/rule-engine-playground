import Promise from 'bluebird';
import { Engine } from 'json-rules-engine';
import fetch from 'node-fetch';



function parseJSON(response) {
  return response.json().catch(error => Promise.reject(new Error(error)));
}


export class RuleEngine {
  constructor() {
    this.engine = new Engine();
  }

  restartRuleEngine() {
    console.log('Rule Engine restarted.');
    this.engine = new Engine();
    this.loadRules();
  }

  loadRules() {
    return fetch('http://localhost:3000/api/rules?access_token=qwer').then(parseJSON).then((dataList) => {
      console.log('Using rules: ');
      console.dir(dataList);
      return dataList;
    }).then(dataList => dataList.map(data => this.engine.addRule(data.rule)));
  }

  runRule(facts) {
    return this.engine.run(facts).then(events =>
    // run() returns events with truthy conditions
    events.map(event => event.params.message));
  }
}

export const ruleEngine = new RuleEngine();
