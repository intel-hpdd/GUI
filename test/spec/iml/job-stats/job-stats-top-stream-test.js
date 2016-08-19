// @flow

import highland from 'highland';

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
        {
          '1': [
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
          ]
        }
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
              id: 'cp.0',
              read_bytes: 189914311.44027776,
              write_bytes: 189914311.44027776,
              read_iops: 189914311.44027776,
              write_iops: 189914311.44027776
            },
            {
              id: 'dd.0',
              read_bytes: 180879592.5972222,
              write_bytes: 180879592.5972222,
              read_iops: 180879592.5972222,
              write_iops: 180879592.5972222
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
              id: 'cp.0',
              read_bytes: 189914311.44027776,
              write_bytes: 189914311.44027776,
              read_iops: 189914311.44027776,
              write_iops: 189914311.44027776
            },
            {
              id: 'dd.0',
              read_bytes: 180879592.5972222,
              write_bytes: 180879592.5972222,
              read_iops: 180879592.5972222,
              write_iops: 180879592.5972222
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
