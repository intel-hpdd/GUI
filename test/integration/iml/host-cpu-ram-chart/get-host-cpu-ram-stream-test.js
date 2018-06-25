import highland from 'highland';
import moment from 'moment';
import { getRequestDuration } from '../../../../source/iml/charting/get-time-params.js';
import { convertNvDates } from '../../../test-utils.js';

import fixtures from '../../../data-fixtures/host-cpu-ram-data-fixtures.json';

describe('The host cpu ram stream', () => {
  let mockSocketStream, bufferDataNewerThan, getHostCpuRamStream, endAndRunTimers, spy;

  beforeEach(() => {
    const mockGetServerMoment = moment('2013-11-18T20:59:30+00:00');

    jest.mock('../../../../source/iml/get-server-moment.js', () => () => mockGetServerMoment);

    const mockCreateStream = () => {
      mockSocketStream = highland();

      endAndRunTimers = x => {
        mockSocketStream.write(x);
        mockSocketStream.end();
        jest.runAllTimers();
      };

      return mockSocketStream;
    };

    jest.mock('../../../../source/iml/socket/socket-stream.js', () => mockCreateStream);

    bufferDataNewerThan = require('../../../../source/iml/charting/buffer-data-newer-than.js').default;

    getHostCpuRamStream = require('../../../../source/iml/host-cpu-ram-chart/get-host-cpu-ram-stream.js').default;

    spy = jest.fn();

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should return a factory function', () => {
    expect(getHostCpuRamStream).toEqual(expect.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    let hostCpuRamStream;

    beforeEach(() => {
      const buff = bufferDataNewerThan(10, 'minutes');
      const requestDuration = getRequestDuration({})(10, 'minutes');

      hostCpuRamStream = getHostCpuRamStream(requestDuration, buff);

      hostCpuRamStream.through(convertNvDates).each(spy);
    });

    describe('when there is data', () => {
      beforeEach(() => {
        endAndRunTimers(fixtures[0].in);
      });

      it('should return a stream', () => {
        expect(highland.isStream(hostCpuRamStream)).toBe(true);
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
            key: 'cpu',
            values: []
          },
          {
            key: 'ram',
            values: []
          }
        ]);
      });

      it('should populate if data comes in on next tick', () => {
        endAndRunTimers(fixtures[0].in[0]);

        expect(spy).toHaveBeenCalledOnceWith([
          {
            key: 'cpu',
            values: [
              {
                x: '2013-11-18T20:59:30.000Z',
                y: 0.5233990147783252
              }
            ]
          },
          {
            key: 'ram',
            values: [
              {
                x: '2013-11-18T20:59:30.000Z',
                y: 0.39722490271763006
              }
            ]
          }
        ]);
      });
    });
  });
});
