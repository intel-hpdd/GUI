import highland from 'highland';
import moment from 'moment';
import { getRequestDuration } from '../../../../source/iml/charting/get-time-params.js';
import { convertNvDates } from '../../../test-utils.js';

import fixtures from '../../../data-fixtures/cpu-usage-fixtures.json';

describe('get cpu usage stream', () => {
  let mockSocketStream,
    bufferDataNewerThan,
    getCpuUsageStream,
    endAndRunTimers,
    spy;

  beforeEach(() => {
    const mockCreateMoment = () => moment('2013-11-15T19:25:20+00:00');

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

    getCpuUsageStream = require('../../../../source/iml/cpu-usage/get-cpu-usage-stream.js')
      .default;

    spy = jest.fn();

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should return a factory function', () => {
    expect(getCpuUsageStream).toEqual(expect.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    let cpuUsageStream;

    beforeEach(() => {
      const buff = bufferDataNewerThan(10, 'minutes');
      const requestDuration = getRequestDuration({})(10, 'minutes');

      cpuUsageStream = getCpuUsageStream(requestDuration, buff);

      cpuUsageStream.through(convertNvDates).each(spy);
    });

    describe('when there is data', () => {
      beforeEach(() => {
        endAndRunTimers(fixtures[0].in);
      });

      it('should return a stream', () => {
        expect(highland.isStream(cpuUsageStream)).toBe(true);
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
            key: 'user',
            values: []
          },
          {
            key: 'system',
            values: []
          },
          {
            key: 'iowait',
            values: []
          }
        ]);
      });

      it('should populate if data comes in on next tick', () => {
        endAndRunTimers(fixtures[0].in[0]);

        expect(spy).toHaveBeenCalledOnceWith([
          {
            key: 'user',
            values: [
              {
                x: '2014-04-11T01:18:40.000Z',
                y: 0.48080645161290325
              }
            ]
          },
          {
            key: 'system',
            values: [
              {
                x: '2014-04-11T01:18:40.000Z',
                y: 0.005
              }
            ]
          },
          {
            key: 'iowait',
            values: [
              {
                x: '2014-04-11T01:18:40.000Z',
                y: 0.005
              }
            ]
          }
        ]);
      });
    });
  });
});
