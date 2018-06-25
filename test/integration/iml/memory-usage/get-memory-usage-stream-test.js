import highland from 'highland';
import moment from 'moment';

import { convertNvDates } from '../../../test-utils.js';
import { getRequestDuration } from '../../../../source/iml/charting/get-time-params.js';

import fixtures from '../../../data-fixtures/memory-usage-fixtures.json';

describe('The memory usage stream', () => {
  let mockSocketStream, getMemoryUsageStream, bufferDataNewerThan, endAndRunTimers, spy;

  beforeEach(() => {
    const mockGetServerMoment = moment('2014-04-14T13:23:00.000Z');

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

    getMemoryUsageStream = require('../../../../source/iml/memory-usage/get-memory-usage-stream.js').default;

    spy = jest.fn();

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should return a factory function', () => {
    expect(getMemoryUsageStream).toEqual(expect.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    let memoryUsageStream;

    beforeEach(() => {
      const buff = bufferDataNewerThan(10, 'minutes');
      const requestDuration = getRequestDuration({})(10, 'minutes');

      memoryUsageStream = getMemoryUsageStream(requestDuration, buff);

      memoryUsageStream.through(convertNvDates).each(spy);
    });

    describe('when there is data', () => {
      beforeEach(() => {
        endAndRunTimers(fixtures[0].in);
      });

      it('should return a stream', () => {
        expect(highland.isStream(memoryUsageStream)).toBe(true);
      });

      it('should return computed data', () => {
        expect(spy).toHaveBeenCalledOnceWith(fixtures[0].out);
      });

      it('should drop duplicate values', () => {
        mockSocketStream.write(fixtures[0].in[0]);
        mockSocketStream.end();
        jest.runOnlyPendingTimers();
        jest.runAllTimers();
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
            key: 'Total memory',
            values: []
          },
          {
            key: 'Used memory',
            values: []
          },
          {
            key: 'Total swap',
            values: []
          },
          {
            key: 'Used swap',
            values: []
          }
        ]);
      });

      it('should populate if data comes in on next tick', () => {
        endAndRunTimers(fixtures[0].in[0]);

        expect(spy).toHaveBeenCalledOnceWith([
          {
            key: 'Total memory',
            values: [
              {
                x: '2014-04-14T13:23:50.000Z',
                y: 522092544
              }
            ]
          },
          {
            key: 'Used memory',
            values: [
              {
                x: '2014-04-14T13:23:50.000Z',
                y: 497561600
              }
            ]
          },
          {
            key: 'Total swap',
            values: [
              {
                x: '2014-04-14T13:23:50.000Z',
                y: 1073733632
              }
            ]
          },
          {
            key: 'Used swap',
            values: [
              {
                x: '2014-04-14T13:23:50.000Z',
                y: 0
              }
            ]
          }
        ]);
      });
    });
  });
});
