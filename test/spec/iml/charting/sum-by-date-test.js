import highland from 'highland';
import sumByDate from '../../../../source/iml/charting/sum-by-date.js';
import jobStatsFixture
  from '../../../data-fixtures/job-stats-fixture.json!json';

import { values } from 'intel-obj';

import { streamToPromise } from '../../../../source/iml/promise-transforms.js';

describe('sum by date', () => {
  itAsync('should sum points as expected', async function() {
    const out = await streamToPromise(
      highland([jobStatsFixture])
        .map(values)
        .flatten()
        .through(sumByDate)
        .collect()
    );

    expect(out).toEqual([
      {
        data: {
          'dd.0': 0
        },

        ts: '2016-09-30T13:18:30+00:00'
      },
      {
        data: {
          'dd.0': 0
        },
        ts: '2016-09-30T13:18:40+00:00'
      },
      {
        data: {
          'dd.0': 0
        },

        ts: '2016-09-30T13:18:50+00:00'
      },
      {
        data: {
          'dd.0': 0
        },

        ts: '2016-09-30T13:19:00+00:00'
      },
      {
        data: {
          'dd.0': 0
        },

        ts: '2016-09-30T13:19:10+00:00'
      },
      {
        data: {
          'dd.0': 0
        },

        ts: '2016-09-30T13:19:20+00:00'
      },
      {
        data: {
          'dd.0': 0
        },

        ts: '2016-09-30T13:19:30+00:00'
      },
      {
        data: {
          'dd.0': 0
        },

        ts: '2016-09-30T13:19:40+00:00'
      },
      {
        data: {
          'dd.0': 0
        },

        ts: '2016-09-30T13:19:50+00:00'
      },
      {
        data: {
          'dd.0': 0
        },

        ts: '2016-09-30T13:20:00+00:00'
      },
      {
        data: {
          'dd.0': 0
        },

        ts: '2016-09-30T13:20:10+00:00'
      },
      {
        data: {
          'dd.0': 0
        },

        ts: '2016-09-30T13:20:20+00:00'
      },
      {
        data: {
          'dd.0': 0
        },

        ts: '2016-09-30T13:20:30+00:00'
      },
      {
        data: {
          'dd.0': 314572.8
        },
        ts: '2016-09-30T13:20:40+00:00'
      },
      {
        data: {
          'dd.0': 4404019.2,
          'cp.0': 20761804.8
        },
        ts: '2016-09-30T13:20:50+00:00'
      },
      {
        data: {
          'cp.0': 39321600,
          'dd.0': 5242880
        },
        ts: '2016-09-30T13:21:00+00:00'
      },
      {
        data: {
          'cp.0': 84410368,
          'dd.0': 1468006.4
        },
        ts: '2016-09-30T13:21:10+00:00'
      },
      {
        data: {
          'cp.0': 74344038.4,
          'dd.0': 0
        },
        ts: '2016-09-30T13:21:20+00:00'
      },
      {
        data: {
          'cp.0': 0,
          'dd.0': 0
        },
        ts: '2016-09-30T13:21:30+00:00'
      },
      {
        data: {
          'dd.0': 0
        },

        ts: '2016-09-30T13:18:20+00:00'
      }
    ]);
  });

  itAsync('should sum empty points correctly', async function() {
    const out = await streamToPromise(
      highland([
        {
          1: [],
          2: [],
          3: []
        }
      ])
        .map(values)
        .flatten()
        .through(sumByDate)
        .collect()
    );

    expect(out).toEqual([]);
  });
});
