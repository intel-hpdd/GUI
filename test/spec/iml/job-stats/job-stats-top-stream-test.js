// @flow

import highland from 'highland';

import jobStatsFixture from '../../../data-fixtures/job-stats-fixture.json!json';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

import {
  streamToPromise
} from '../../../../source/iml/promise-transforms.js';

import type {
  spyT
} from 'jasmine';

type callablePropT = spyT & {
  setLatest:Function
};

describe('job stats top stream', () => {
  let topDuration,
    topRange,
    getRequestDuration,
    requestDuration:callablePropT,
    getRequestRange,
    requestRange:callablePropT,
    socketStream,
    bufferDataNewerThan;

  beforeEachAsync(async function () {
    socketStream = jasmine
      .createSpy('socketStream')
      .and
      .callFake(() => highland([
        jobStatsFixture
      ]));

    requestDuration = jasmine
      .createSpy('requestDuration')
      .and
      .callFake(x => x);

    requestDuration.setLatest = jasmine
      .createSpy('setLatest')
      .and
      .callFake(x => x);

    getRequestDuration = jasmine
      .createSpy('getRequestDuration')
      .and
      .returnValue(requestDuration);

    requestRange = jasmine
      .createSpy('requestRange')
      .and
      .callFake(x => x);

    requestRange.setLatest = jasmine
      .createSpy('setLatest')
      .and
      .callFake(x => x);

    getRequestRange = jasmine
      .createSpy('getRequestRange')
      .and
      .returnValue(requestRange);

    bufferDataNewerThan = jasmine
      .createSpy('bufferDataNewerThan')
      .and
      .returnValue(x => x);

    const mod = await mock(
      'source/iml/job-stats/job-stats-top-stream.js',
      {
        'source/iml/socket/socket-stream.js': {
          default: socketStream
        },
        'source/iml/charting/get-time-params.js': {
          getRequestDuration,
          getRequestRange
        },
        'source/iml/charting/buffer-data-newer-than.js': {
          default: bufferDataNewerThan
        }
      }
    );

    ({
      topDuration,
      topRange
    } = mod);
  });

  afterEach(resetAll);

  describe('duration$', () => {
    describe('without id', () => {
      let result;

      beforeEachAsync(async function () {
        result = await streamToPromise(
          topDuration()
        );
      });

      it('should call getRequestDuration', () => {
        expect(getRequestDuration)
          .toHaveBeenCalledNTimesWith(4, {}, 10, 'minute');
      });

      [
        'read_bytes',
        'write_bytes',
        'read_iops',
        'write_iops'
      ].forEach(metrics =>
        it(`should call for ${metrics} metric`, () => {
          expect(socketStream)
            .toHaveBeenCalledOnceWith('/target/metric', {
              qs: {
                job: 'id',
                metrics
              }
            }, true);
        })
      );

      it('should aggregate metrics', () => {
        expect(result)
          .toEqual([
            {
              'id': 'dd.0',
              'read_bytes_average': 571473.92,
              'read_bytes_min': 0,
              'read_bytes_max': 5242880,
              'write_bytes_average': 571473.92,
              'write_bytes_min': 0,
              'write_bytes_max': 5242880,
              'read_iops_average': 571473.92,
              'read_iops_min': 0,
              'read_iops_max': 5242880,
              'write_iops_average': 571473.92,
              'write_iops_min': 0,
              'write_iops_max': 5242880
            },
            {
              'id': 'cp.0',
              'read_bytes_average': 43767562.24,
              'read_bytes_min': 0,
              'read_bytes_max': 84410368,
              'write_bytes_average': 43767562.24,
              'write_bytes_min': 0,
              'write_bytes_max': 84410368,
              'read_iops_average': 43767562.24,
              'read_iops_min': 0,
              'read_iops_max': 84410368,
              'write_iops_average': 43767562.24,
              'write_iops_min': 0,
              'write_iops_max': 84410368
            }
          ]);
      });
    });

    describe('with id', () => {
      beforeEachAsync(async function () {
        await streamToPromise(
          topDuration(11, 'second', {
            id: '5'
          })
        );
      });

      it('should call getRequestDuration', () => {
        expect(getRequestDuration)
          .toHaveBeenCalledNTimesWith(
            4,
            { id: '5' },
            11,
            'second'
          );
      });
    });

    describe('multiple', () => {
      let spy;

      beforeEach(() => {
        spy = jasmine
                .createSpy('spy');

        jasmine.clock().install();

        topDuration()
          .each(spy);
      });

      afterEach(() => jasmine.clock().uninstall());

      it('should call once before 10s', () => {
        expect(spy)
          .toHaveBeenCalledOnce();
      });

      it('should call every 10s', () => {
        jasmine
          .clock()
          .tick(10000);

        expect(spy)
          .toHaveBeenCalledTwice();
      });
    });
  });


  describe('range$', () => {
    describe('without id', () => {
      let result;

      beforeEachAsync(async function () {
        result = await streamToPromise(
          topRange(
            '2016-08-17T18:34:04.000Z',
            '2016-08-17T18:34:20.000Z'
          )
        );
      });

      it('should call getRequestRange', () => {
        expect(getRequestRange)
          .toHaveBeenCalledNTimesWith(
            4,
            {},
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
          expect(socketStream)
            .toHaveBeenCalledOnceWith('/target/metric', {
              qs: {
                job: 'id',
                metrics
              }
            }, true);
        })
      );

      it('should aggregate metrics', () => {
        expect(result)
          .toEqual([
            {
              'id': 'dd.0',
              'read_bytes_average': 571473.92,
              'read_bytes_min': 0,
              'read_bytes_max': 5242880,
              'write_bytes_average': 571473.92,
              'write_bytes_min': 0,
              'write_bytes_max': 5242880,
              'read_iops_average': 571473.92,
              'read_iops_min': 0,
              'read_iops_max': 5242880,
              'write_iops_average': 571473.92,
              'write_iops_min': 0,
              'write_iops_max': 5242880
            },
            {
              'id': 'cp.0',
              'read_bytes_average': 43767562.24,
              'read_bytes_min': 0,
              'read_bytes_max': 84410368,
              'write_bytes_average': 43767562.24,
              'write_bytes_min': 0,
              'write_bytes_max': 84410368,
              'read_iops_average': 43767562.24,
              'read_iops_min': 0,
              'read_iops_max': 84410368,
              'write_iops_average': 43767562.24,
              'write_iops_min': 0,
              'write_iops_max': 84410368
            }
          ]);
      });
    });

    describe('with id', () => {
      beforeEachAsync(async function () {
        await streamToPromise(
          topRange(
            '2016-08-17T18:34:04.000Z',
            '2016-08-17T18:34:20.000Z',
            {
              id: '5'
            }
          )
        );
      });

      it('should call getRequestDuration', () => {
        expect(getRequestRange)
          .toHaveBeenCalledNTimesWith(
            4,
            { id: '5' },
            '2016-08-17T18:34:04.000Z',
            '2016-08-17T18:34:20.000Z'
          );
      });
    });
  });

});
