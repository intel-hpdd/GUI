import cpuUsageDataFixtures from '../../../data-fixtures/cpu-usage-fixtures';
import highland from 'highland';
import moment from 'moment';

import {
  default as Maybe,
  withDefault
} from 'intel-maybe';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('get cpu usage stream', () => {
  var socketStream, serverStream, getServerMoment, bufferDataNewerThan,
    mod, getCpuUsageStream, getRequestDuration;

  beforeEachAsync(async function () {
    socketStream = jasmine.createSpy('socketStream')
      .and.callFake(() => (serverStream = highland()));

    getServerMoment = jasmine.createSpy('getServerMoment')
      .and.returnValue(moment('2014-04-11T01:18:00+00:00'));

    const createDate = jasmine.createSpy('createDate')
      .and.callFake(arg => withDefault(
        () => new Date(),
        Maybe.of(arg)
          .map(x => new Date(x))));

    const getTimeParamsModule = await mock('source/iml/charting/get-time-params.js', {
      'source/iml/get-server-moment.js': { default: getServerMoment },
      'source/iml/create-date.js': { default: createDate }
    });
    getRequestDuration = getTimeParamsModule.getRequestDuration;

    const bufferDataNewerThanModule = await mock('source/iml/charting/buffer-data-newer-than.js', {});
    bufferDataNewerThan = bufferDataNewerThanModule.default;

    mod = await mock('source/iml/cpu-usage/get-cpu-usage-stream.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    getCpuUsageStream = mod.default;
  });

  var fixtures, revert, spy;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');

    fixtures = cpuUsageDataFixtures;

    revert = patchRateLimit();
  });

  afterEach(() => {
    revert();
    resetAll();
  });

  it('should return a factory function', () => {
    expect(getCpuUsageStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    var cpuUsageStream;

    beforeEach(() => {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration({}, 10, 'minutes');

      cpuUsageStream = getCpuUsageStream(requestDuration, buff);

      cpuUsageStream
        .through(convertNvDates)
        .each(spy);
    });

    describe('when there is data', () => {
      beforeEach(() => {
        serverStream.write(fixtures[0].in);
        serverStream.end();
      });

      it('should return a stream', () => {
        expect(highland.isStream(cpuUsageStream)).toBe(true);
      });

      it('should return computed data', () => {
        expect(spy).toHaveBeenCalledOnceWith(fixtures[0].out);
      });

      it('should drop duplicate values', () => {
        serverStream.write(fixtures[0].in[0]);
        serverStream.end();

        expect(spy).toHaveBeenCalledTwiceWith(fixtures[0].out);
      });
    });

    describe('when there is no initial data', () => {
      beforeEach(() => {
        serverStream.write([]);
        serverStream.end();
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
        serverStream.write(fixtures[0].in[0]);
        serverStream.end();

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
