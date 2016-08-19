// @flow

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('job stats reducer', () => {
  let jobStatsReducer;

  beforeEachAsync(async function () {
    const mod = await mock(
      'source/iml/job-stats/job-stats-reducer.js',
      {}
    );

    jobStatsReducer = mod.default;
  });

  afterEach(resetAll);

  it('should return the payload', () => {
    expect(jobStatsReducer(undefined, {}))
      .toEqual({
        duration: 10,
        orderBy: 'read_bytes',
        desc: true
      });
  });

  it('should update the duration', () => {
    expect(jobStatsReducer(undefined, {
      type: 'SET_DURATION',
      payload: {
        duration: 5
      }
    }))
      .toEqual({
        duration: 5,
        orderBy: 'read_bytes',
        desc: true
      });
  });

  it('should update the sort', () => {
    expect(jobStatsReducer(undefined, {
      type: 'SET_SORT',
      payload: {
        orderBy: 'write_bytes',
        desc: false
      }
    }))
      .toEqual({
        duration: 10,
        orderBy: 'write_bytes',
        desc: false
      });
  });
});
