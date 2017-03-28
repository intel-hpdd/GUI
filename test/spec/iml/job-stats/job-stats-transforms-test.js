import highland from 'highland';

import { streamToPromise } from '../../../../source/iml/promise-transforms.js';

import { mock, resetAll } from '../../../system-mock.js';

describe('job stats transforms', () => {
  let reduceToStruct, collectById, calculateData, normalize;

  beforeEachAsync(async function() {
    const mod = await mock('source/iml/job-stats/job-stats-transforms.js', {});

    ({
      reduceToStruct,
      collectById,
      calculateData,
      normalize
    } = mod);
  });

  afterEach(resetAll);

  describe('reduceToStruct', () => {
    it('should reduce a key value structure', () => {
      expect(
        reduceToStruct({
          k1: 'v1',
          k2: 'v2'
        })
      ).toEqual([
        {
          data: 'v1',
          id: 'k1'
        },
        {
          data: 'v2',
          id: 'k2'
        }
      ]);
    });
  });

  describe('normalize', () => {
    itAsync('should convert a list structure', async function() {
      const s = highland([
        {
          data: {
            'cp.0': 174396378.92222223,
            'dd.0': 157565007.50277779
          },
          ts: '2016-08-09T15:03:00+00:00'
        },
        {
          data: {
            'cp.0': 205432243.9583333,
            'dd.0': 204194177.69166663
          },
          ts: '2016-08-09T15:04:00+00:00'
        }
      ]);

      const result = await streamToPromise(normalize(s).collect());

      expect(result).toEqual([
        {
          data: 174396378.92222223,
          id: 'cp.0'
        },
        {
          data: 157565007.50277779,
          id: 'dd.0'
        },
        {
          data: 205432243.9583333,
          id: 'cp.0'
        },
        {
          data: 204194177.69166663,
          id: 'dd.0'
        }
      ]);
    });
  });

  describe('calculateData', () => {
    itAsync('should work with empty data', async function() {
      const s = highland([]);

      const result = await streamToPromise(calculateData(s));

      expect(result).toEqual([]);
    });

    itAsync('should calculate correctly', async function() {
      const s = highland([
        {
          data: 174396378.92222223,
          id: 'cp.0',
          ts: '2016-08-09T15:03:00+00:00'
        },
        {
          data: 157565007.50277779,
          id: 'dd.0',
          ts: '2016-08-09T15:03:00+00:00'
        },
        {
          data: 205432243.9583333,
          id: 'cp.0',
          ts: '2016-08-09T15:04:00+00:00'
        },
        {
          data: 204194177.69166663,
          id: 'dd.0',
          ts: '2016-08-09T15:04:00+00:00'
        }
      ]);

      const result = await streamToPromise(calculateData(s));

      expect(result).toEqual([
        {
          data: {
            average: 189914311.440277765,
            max: 205432243.9583333,
            min: 174396378.92222223
          },
          id: 'cp.0'
        },
        {
          data: {
            average: 180879592.5972222,
            max: 204194177.69166663,
            min: 157565007.50277779
          },
          id: 'dd.0'
        }
      ]);
    });
  });

  describe('collectById', () => {
    itAsync('should work with empty data', async function() {
      const result = await streamToPromise(
        collectById(highland([highland([]), highland([])]))
      );

      expect(result).toEqual([]);
    });

    itAsync('should collect as expected', async function() {
      const result = await streamToPromise(
        collectById(
          highland([
            highland([
              {
                read_bytes: 189914311.440277765,
                id: 'cp.0'
              },
              {
                read_bytes: 180879592.5972222,
                id: 'dd.0'
              }
            ]),
            highland([
              {
                write_bytes: 200,
                id: 'cp.0'
              },
              {
                write_bytes: 300,
                id: 'dd.0'
              }
            ])
          ])
        )
      );

      expect(result).toEqual([
        {
          id: 'cp.0',
          read_bytes: 189914311.440277765,
          write_bytes: 200
        },
        {
          id: 'dd.0',
          read_bytes: 180879592.5972222,
          write_bytes: 300
        }
      ]);
    });
  });
});
