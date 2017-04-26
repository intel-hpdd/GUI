import highland from 'highland';
import moment from 'moment';
import { getRequestDuration } from '../../../../source/iml/charting/get-time-params.js';
import { convertNvDates } from '../../../test-utils.js';

import fixtures from '../../../data-fixtures/read-write-bandwidth-fixtures.json';

describe('The read write bandwidth stream', () => {
  let mockSocketStream,
    bufferDataNewerThan,
    getReadWriteBandwidthStream,
    endAndRunTimers,
    spy;

  beforeEach(() => {
    const mockCreateMoment = () => moment('2013-12-11T13:15:00+00:00');

    jest.mock(
      '../../../../source/iml/get-server-moment.js',
      () => mockCreateMoment
    );

    const mockCreateStream = () => {
      mockSocketStream = highland();

      endAndRunTimers = x => {
        mockSocketStream.write(x);
        mockSocketStream.end();
        jest.runAllTimers();
      };

      return mockSocketStream;
    };

    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockCreateStream
    );

    bufferDataNewerThan = require('../../../../source/iml/charting/buffer-data-newer-than.js')
      .default;

    getReadWriteBandwidthStream = require('../../../../source/iml/read-write-bandwidth/get-read-write-bandwidth-stream.js')
      .default;

    spy = jest.fn();

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should return a factory function', () => {
    expect(getReadWriteBandwidthStream).toEqual(expect.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    let readWriteBandwidthStream;

    beforeEach(() => {
      const buff = bufferDataNewerThan(10, 'minutes');
      const requestDuration = getRequestDuration({})(10, 'minutes');

      readWriteBandwidthStream = getReadWriteBandwidthStream(
        requestDuration,
        buff
      );

      readWriteBandwidthStream.through(convertNvDates).each(spy);
    });

    describe('when there is data', () => {
      beforeEach(() => {
        endAndRunTimers(fixtures[0].in);
      });

      it('should return a stream', () => {
        expect(highland.isStream(readWriteBandwidthStream)).toBe(true);
      });

      it('should return computed data', () => {
        expect(spy).toHaveBeenCalledOnceWith(fixtures[0].out);
      });

      it('should drop duplicate values', () => {
        endAndRunTimers(fixtures[0].in[0]);

        expect(spy).toHaveBeenCalledTwiceWith(fixtures[0].out);
      });
    });

    describe('when there is no initial data', () => {
      beforeEach(() => {
        endAndRunTimers([]);
      });

      it('should return an empty nvd3 structure', () => {
        expect(spy).toHaveBeenCalledOnceWith([
          {
            key: 'read',
            values: []
          },
          {
            key: 'write',
            values: []
          }
        ]);
      });

      it('should populate if data comes in on next tick', () => {
        endAndRunTimers(fixtures[0].in[0]);
        expect(spy).toHaveBeenCalledOnceWith([
          {
            key: 'read',
            values: [{ x: '2013-12-11T13:15:00.000Z', y: 106772238984.1 }]
          },
          {
            key: 'write',
            values: [{ x: '2013-12-11T13:15:00.000Z', y: -104418696882.20003 }]
          }
        ]);
      });
    });
  });
});
