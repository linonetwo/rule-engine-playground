import { Engine } from 'json-rules-engine';


const engine = new Engine();

engine.addRule({
  conditions: {
    any: [
      {
        all: [
          {
            fact: 'type',
            operator: 'equal',
            value: 'dht11'
          },
          {
            fact: 'metric',
            operator: 'equal',
            value: 'temperature'
          },
          {
            fact: 'value',
            operator: 'greaterThanInclusive',
            value: 50
          }
        ]
      },
    ]
  },
  event: {
    type: 'HighTemperatureAlarm',
    params: {
      message: 'Device is in high temperature.'
    }
  }
});

const facts = {
  timestamp: '1486174258155',
  metric: 'temperature',
  value: 52,
  type: 'dht11',
  id: 'dht11-01',
  mac: '5CFG',
  gateway: '3044a1000574'
};

engine
  .run(facts)
  .then((events) => { // run() returns events with truthy conditions
    events.map(event => console.log(event.params.message));
  });
