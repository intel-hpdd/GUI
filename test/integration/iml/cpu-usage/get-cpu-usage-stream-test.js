import highland from 'highland';
import moment from 'moment';
import * as maybe from '@mfl/maybe';

import cpuUsageDataFixtures from '../../../data-fixtures/cpu-usage-fixtures.json';

import { mock, resetAll } from '../../../system-mock.js';

describe('get cpu usage stream', () => {
  let socketStream,
    serverStream,
    getServerMoment,
    bufferDataNewerThan,
    mod,
    getCpuUsageStream,
    getRequestDuration;

  beforeEachAsync(async function() {
    socketStream = jasmine
      .createSpy('socketStream')
      .and.callFake(() => (serverStream = highland()));

    getServerMoment = jasmine
      .createSpy('getServerMoment')
      .and.returnValue(moment('2014-04-11T01:18:00+00:00'));

    const createDate = jasmine
      .createSpy('createDate')
      .and.callFake(arg =>
        maybe.withDefault(
          () => new Date(),
          maybe.map(x => new Date(x), maybe.of(arg))
        )
      );

    const getTimeParamsModule = await mock(
      'source/iml/charting/get-time-params.js',
      {
        'source/iml/get-server-moment.js': { default: getServerMoment },
        'source/iml/create-date.js': { default: createDate }
      }
    );
    getRequestDuration = getTimeParamsModule.getRequestDuration;

    const bufferDataNewerThanModule = await mock(
      'source/iml/charting/buffer-data-newer-than.js',
      {}
    );
    bufferDataNewerThan = bufferDataNewerThanModule.default;

    mod = await mock('source/iml/cpu-usage/get-cpu-usage-stream.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    getCpuUsageStream = mod.default;

    jasmine.clock().install();
  }, 10000);

  let fixtures, spy;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');

    fixtures = cpuUsageDataFixtures;
  });

  afterEach(() => {
    resetAll();
    jasmine.clock().uninstall();
  });

  it('should return a factory function', () => {
    expect(getCpuUsageStream).toEqual(expect.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    let cpuUsageStream;

    beforeEach(() => {
      const buff = bufferDataNewerThan(10, 'minutes');
      const requestDuration = getRequestDuration({}, 10, 'minutes');

      cpuUsageStream = getCpuUsageStream(requestDuration, buff);

      cpuUsageStream.through(convertNvDates).each(spy);
    });

    describe('when there is data', () => {
      beforeEach(() => {
        serverStream.write(fixtures[0].in);
        serverStream.end();
        jasmine.clock().tick(10000);
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
        jasmine.clock().tick(10000);

        expect(spy).toHaveBeenCalledTwiceWith(fixtures[0].out);
      });
    });

    describe('when there is no initial data', () => {
      beforeEach(() => {
        serverStream.write([]);
        serverStream.end();
        jasmine.clock().tick(10000);
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
        jasmine.clock().tick(10000);

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
