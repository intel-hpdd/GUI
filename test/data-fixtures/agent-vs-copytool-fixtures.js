import angular from 'angular';

angular.module('dataFixtures').value('agentVsCopytoolFixtures', [
  {
    in: {
      1: [],
      2: [
        {
          data: {
            hsm_actions_running: 3,
            hsm_actions_waiting: 178,
            hsm_agents_idle: 0
          },
          ts: '2015-12-04T18:42:30+00:00'
        },
        {
          data: {
            hsm_actions_running: 58,
            hsm_actions_waiting: 123,
            hsm_agents_idle: 0
          },
          ts: '2015-12-04T18:42:40+00:00'
        }
      ],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [
        {
          data: {
            hsm_actions_running: 3,
            hsm_actions_waiting: 6,
            hsm_agents_idle: 0
          },
          ts: '2015-12-04T18:42:30+00:00'
        },
        {
          data: {
            hsm_actions_running: 6,
            hsm_actions_waiting: 3,
            hsm_agents_idle: 0
          },
          ts: '2015-12-04T18:42:40+00:00'
        }
      ],
      9: [],
      10: [],
      11: [],
      12: []
    },
    out: [
      {
        'running actions': 6,
        'waiting requests': 184,
        'idle workers': 0,
        ts: '2015-12-04T18:42:30+00:00'
      },
      {
        'running actions': 64,
        'waiting requests': 126,
        'idle workers': 0,
        ts: '2015-12-04T18:42:40+00:00'
      }
    ]
  }
]);
