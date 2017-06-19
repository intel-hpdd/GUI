// @flow

import highland from 'highland';

import jobStatsFixture from '../../../data-fixtures/job-stats-fixture.json';

import { streamToPromise } from '../../../../source/iml/promise-transforms.js';

type callablePropT = {
  setLatest: Function
};

describe('job stats top stream', () => {
  let topDuration,
    topRange,
    mockGetRequestDuration,
    requestDurationOverrides: callablePropT,
    mockGetRequestRange,
    requestRangeOverrides: callablePropT,
    mockSocketStream,
    mockBufferDataNewerThan,
    requestDuration,
    requestRange;

  beforeEach(() => {
    jest.useFakeTimers();

    mockSocketStream = jest.fn(() => highland([jobStatsFixture]));

    requestDuration = jest.fn(x => x);
    requestDuration.setLatest = jest.fn(x => x);

    requestDurationOverrides = jest.fn(() => requestDuration);

    mockGetRequestDuration = jest.fn(() => requestDurationOverrides);

    requestRange = jest.fn(x => x);
    requestRange.setLatest = jest.fn(x => x);
    requestRangeOverrides = jest.fn(() => requestRange);

    mockGetRequestRange = jest.fn(() => requestRangeOverrides);

    mockBufferDataNewerThan = jest.fn(() => x => x);

    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );
    jest.mock('../../../../source/iml/charting/get-time-params.js', () => ({
      getRequestDuration: mockGetRequestDuration,
      getRequestRange: mockGetRequestRange
    }));
    jest.mock(
      '../../../../source/iml/charting/buffer-data-newer-than.js',
      () => mockBufferDataNewerThan
    );

    const mod = require('../../../../source/iml/job-stats/job-stats-top-stream.js');

    ({ topDuration, topRange } = mod);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('duration$', () => {
    describe('without id', () => {
      let result;

      beforeEach(async function() {
        result = await streamToPromise(topDuration());
      });

      it('should call getRequestDuration with overrides', () => {
        expect(mockGetRequestDuration).toHaveBeenCalledTimes(4);
        expect(mockGetRequestDuration).toHaveBeenCalledWith({});
      });

      it('should call requestDuration with params', () => {
        expect(requestDurationOverrides).toHaveBeenCalledTimes(4);
        expect(requestDurationOverrides).toHaveBeenCalledWith(10, 'minute');
      });

      [
        'read_bytes',
        'write_bytes',
        'read_iops',
        'write_iops'
      ].forEach(metrics =>
        it(`should call for ${metrics} metric`, () => {
          expect(mockSocketStream).toHaveBeenCalledOnceWith(
            '/target/metric',
            {
              qs: {
                job: 'id',
                metrics
              }
            },
            true
          );
        })
      );

      it('should aggregate metrics', () => {
        expect(result).toEqual([
          {
            id: 'dd.0',
            read_bytes_average: 571473.92,
            read_bytes_min: 0,
            read_bytes_max: 5242880,
            write_bytes_average: 571473.92,
            write_bytes_min: 0,
            write_bytes_max: 5242880,
            read_iops_average: 571473.92,
            read_iops_min: 0,
            read_iops_max: 5242880,
            write_iops_average: 571473.92,
            write_iops_min: 0,
            write_iops_max: 5242880
          },
          {
            id: 'cp.0',
            read_bytes_average: 43767562.24,
            read_bytes_min: 0,
            read_bytes_max: 84410368,
            write_bytes_average: 43767562.24,
            write_bytes_min: 0,
            write_bytes_max: 84410368,
            read_iops_average: 43767562.24,
            read_iops_min: 0,
            read_iops_max: 84410368,
            write_iops_average: 43767562.24,
            write_iops_min: 0,
            write_iops_max: 84410368
          }
        ]);
      });
    });

    describe('with id', () => {
      beforeEach(async () => {
        await streamToPromise(
          topDuration(11, 'second', {
            id: '5'
          })
        );
      });

      it('should call getRequestDuration', () => {
        expect(mockGetRequestDuration).toHaveBeenCalledTimes(4);
        expect(mockGetRequestDuration).toHaveBeenCalledWith({ id: '5' });
      });

      it('should call requestDuration with the parameters', () => {
        expect(requestDurationOverrides).toHaveBeenCalledTimes(4);
        expect(requestDurationOverrides).toHaveBeenCalledWith(11, 'second');
      });
    });

    describe('multiple', () => {
      let spy;

      beforeEach(() => {
        spy = jest.fn();
        topDuration().each(spy);
      });

      it('should call once before 10s', () => {
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should call every 10s', () => {
        jest.runTimersToTime(10000);

        expect(spy).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('range$', () => {
    describe('without id', () => {
      let result;

      beforeEach(async () => {
        result = await streamToPromise(
          topRange('2016-08-17T18:34:04.000Z', '2016-08-17T18:34:20.000Z')
        );
      });

      it('should call getRequestRange', () => {
        expect(mockGetRequestRange).toHaveBeenCalledTimes(4);
        expect(mockGetRequestRange).toHaveBeenCalledWith({});
      });

      it('should call getRequestRange with parameters', () => {
        expect(requestRangeOverrides).toHaveBeenCalledTimes(4);
        expect(requestRangeOverrides).toHaveBeenCalledWith(
          '2016-08-17T18:34:04.000Z',
          '2016-08-17T18:34:20.000Z'
        );
      });

      [
        'read_bytes',
        'write_bytes',
        'read_iops',
        'write_iops'
      ].forEach(metrics =>
        it(`should call for ${metrics} metric`, () => {
          expect(mockSocketStream).toHaveBeenCalledOnceWith(
            '/target/metric',
            {
              qs: {
                job: 'id',
                metrics
              }
            },
            true
          );
        })
      );

      it('should aggregate metrics', () => {
        expect(result).toEqual([
          {
            id: 'dd.0',
            read_bytes_average: 571473.92,
            read_bytes_min: 0,
            read_bytes_max: 5242880,
            write_bytes_average: 571473.92,
            write_bytes_min: 0,
            write_bytes_max: 5242880,
            read_iops_average: 571473.92,
            read_iops_min: 0,
            read_iops_max: 5242880,
            write_iops_average: 571473.92,
            write_iops_min: 0,
            write_iops_max: 5242880
          },
          {
            id: 'cp.0',
            read_bytes_average: 43767562.24,
            read_bytes_min: 0,
            read_bytes_max: 84410368,
            write_bytes_average: 43767562.24,
            write_bytes_min: 0,
            write_bytes_max: 84410368,
            read_iops_average: 43767562.24,
            read_iops_min: 0,
            read_iops_max: 84410368,
            write_iops_average: 43767562.24,
            write_iops_min: 0,
            write_iops_max: 84410368
          }
        ]);
      });
    });

    describe('with id', () => {
      beforeEach(async () => {
        await streamToPromise(
          topRange('2016-08-17T18:34:04.000Z', '2016-08-17T18:34:20.000Z', {
            id: '5'
          })
        );
      });

      it('should call getRequestRange', () => {
        expect(mockGetRequestRange).toHaveBeenCalledTimes(4);
        expect(mockGetRequestRange).toHaveBeenCalledWith({ id: '5' });
      });

      it('should call requestRange with the parameters', () => {
        expect(requestRangeOverrides).toHaveBeenCalledTimes(4);
        expect(requestRangeOverrides).toHaveBeenCalledWith(
          '2016-08-17T18:34:04.000Z',
          '2016-08-17T18:34:20.000Z'
        );
      });
    });
  });
});
