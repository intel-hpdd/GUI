// @flow

import highland from 'highland';
import { streamToPromise } from '../../../../source/iml/promise-transforms.js';

import { mock, resetAll } from '../../../system-mock.js';

describe('jobstats resolves', () => {
  let jobstats$, getData, topDuration, topRange, store;

  beforeEachAsync(async function() {
    topDuration = jasmine
      .createSpy('topDuration')
      .and.returnValue(highland(['topDuration']));

    topRange = jasmine.createSpy('topRange').and.returnValue('topRange');

    store = {
      select: jasmine.createSpy('select').and.callFake(name => {
        if (name === 'targets')
          return highland([
            [
              {
                id: '1',
                name: 'foo'
              }
            ]
          ]);
        else if (name === 'jobStatsConfig')
          return highland([
            {
              duration: 5
            }
          ]);
      })
    };

    const mod = await mock('source/iml/job-stats/job-stats-resolves.js', {
      'source/iml/job-stats/job-stats-top-stream.js': {
        topDuration,
        topRange
      },
      'source/iml/store/get-store.js': {
        default: store
      },
      'node_modules/moment/moment.js': {
        default: x => ({
          format: () => x
        })
      }
    });

    ({
      jobstats$,
      getData
    } = mod);
  });

  afterEach(resetAll);

  describe('jobstats$', () => {
    itAsync(
      'should select duration when there is no id prop',
      async function() {
        await jobstats$({});

        expect(topDuration).toHaveBeenCalledOnceWith(5);
      }
    );

    itAsync(
      'should return duration info if there is no id prop',
      async function() {
        const result = await jobstats$({}).then(streamToPromise);

        expect(result).toBe('topDuration');
      }
    );

    it('should select range when there is an id prop', () => {
      jobstats$({
        id: '1',
        startDate: '2016-08-17T18:34:04.000Z',
        endDate: '2016-08-17T18:34:20.000Z'
      });

      expect(
        topRange
      ).toHaveBeenCalledOnceWith(
        '2016-08-17T18:34:04.000Z',
        '2016-08-17T18:34:20.000Z',
        {
          qs: {
            id: '1'
          }
        }
      );
    });
  });

  describe('getData', () => {
    it('should return an empty object when there is no id prop', () => {
      expect(getData({})).toEqual({});
    });

    itAsync(
      'it should return a label when there is an id prop',
      async function() {
        const result = await getData({
          id: '1',
          startDate: '2016-08-17T18:34:04.000Z',
          endDate: '2016-08-17T18:34:20.000Z'
        });

        expect(result).toEqual({
          label: 'foo (2016-08-17T18:34:04.000Z - 2016-08-17T18:34:20.000Z)'
        });
      }
    );
  });
});
