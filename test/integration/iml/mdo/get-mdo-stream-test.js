import highland from 'highland';
import moment from 'moment';
import { getRequestDuration } from '../../../../source/iml/charting/get-time-params.js';
import { convertNvDates } from '../../../test-utils.js';

import fixtures from '../../../data-fixtures/mdo-data-fixture.json';

describe('mdo stream', () => {
  let mockSocketStream, bufferDataNewerThan, getMdoStream, endAndRunTimers, spy;

  beforeEach(() => {
    const mockCreateMoment = () => moment('2013-11-15T19:25:20+00:00');

    jest.mock('../../../../source/iml/get-server-moment.js', () => mockCreateMoment);

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

    getMdoStream = require('../../../../source/iml/mdo/get-mdo-stream.js').default;

    spy = jest.fn();

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should return a factory function', () => {
    expect(getMdoStream).toEqual(expect.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    let mdoStream;

    beforeEach(() => {
      const buff = bufferDataNewerThan(10, 'minutes');
      const requestDuration = getRequestDuration({})(10, 'minutes');

      mdoStream = getMdoStream(requestDuration, buff);

      mdoStream.through(convertNvDates).each(spy);
    });

    describe('when there is data', () => {
      beforeEach(() => {
        endAndRunTimers(fixtures[0].in);
      });

      it('should return a stream', () => {
        expect(highland.isStream(mdoStream)).toBe(true);
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
            key: 'close',
            values: []
          },
          {
            key: 'getattr',
            values: []
          },
          {
            key: 'getxattr',
            values: []
          },
          {
            key: 'link',
            values: []
          },
          {
            key: 'mkdir',
            values: []
          },
          {
            key: 'mknod',
            values: []
          },
          {
            key: 'open',
            values: []
          },
          {
            key: 'rename',
            values: []
          },
          {
            key: 'rmdir',
            values: []
          },
          {
            key: 'setattr',
            values: []
          },
          {
            key: 'statfs',
            values: []
          },
          {
            key: 'unlink',
            values: []
          }
        ]);
      });

      it('should populate if data comes in on next tick', () => {
        endAndRunTimers(fixtures[0].in[0]);

        expect(spy).toHaveBeenCalledOnceWith([
          {
            key: 'close',
            values: [
              {
                x: '2013-11-15T19:25:20.000Z',
                y: 280.2
              }
            ]
          },
          {
            key: 'getattr',
            values: [
              {
                x: '2013-11-15T19:25:20.000Z',
                y: 0
              }
            ]
          },
          {
            key: 'getxattr',
            values: [
              {
                x: '2013-11-15T19:25:20.000Z',
                y: 961.1
              }
            ]
          },
          {
            key: 'link',
            values: [
              {
                x: '2013-11-15T19:25:20.000Z',
                y: 0
              }
            ]
          },
          {
            key: 'mkdir',
            values: [
              {
                x: '2013-11-15T19:25:20.000Z',
                y: 413.2
              }
            ]
          },
          {
            key: 'mknod',
            values: [
              {
                x: '2013-11-15T19:25:20.000Z',
                y: 0
              }
            ]
          },
          {
            key: 'open',
            values: [
              {
                x: '2013-11-15T19:25:20.000Z',
                y: 91.9
              }
            ]
          },
          {
            key: 'rename',
            values: [
              {
                x: '2013-11-15T19:25:20.000Z',
                y: 0
              }
            ]
          },
          {
            key: 'rmdir',
            values: [
              {
                x: '2013-11-15T19:25:20.000Z',
                y: 863.3
              }
            ]
          },
          {
            key: 'setattr',
            values: [
              {
                x: '2013-11-15T19:25:20.000Z',
                y: 0
              }
            ]
          },
          {
            key: 'statfs',
            values: [
              {
                x: '2013-11-15T19:25:20.000Z',
                y: 0
              }
            ]
          },
          {
            key: 'unlink',
            values: [
              {
                x: '2013-11-15T19:25:20.000Z',
                y: 848.8
              }
            ]
          }
        ]);
      });
    });
  });
});
