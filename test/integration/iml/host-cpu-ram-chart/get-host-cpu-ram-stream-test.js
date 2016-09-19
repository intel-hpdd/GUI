import highland from 'highland';
import moment from 'moment';

import hostCpuRamDataFixtures from
  '../../../data-fixtures/host-cpu-ram-data-fixtures.json!json';

import {
  default as Maybe,
  withDefault
} from 'intel-maybe';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('The host cpu ram stream', () => {
  var socketStream, serverStream, bufferDataNewerThan,
    getServerMoment, getHostCpuRamStream,
    getRequestDuration;

  beforeEachAsync(async function () {
    socketStream = jasmine.createSpy('socketStream')
      .and.callFake(() => (serverStream = highland()));

    getServerMoment = jasmine
      .createSpy('getServerMoment')
      .and
      .returnValue(
        moment('2013-11-18T20:59:30+00:00')
      );

    const bufferDataNewerThanModule = await mock('source/iml/charting/buffer-data-newer-than.js', {
      'source/iml/get-server-moment.js': { default: getServerMoment }
    });
    bufferDataNewerThan = bufferDataNewerThanModule.default;

    const createDate = jasmine.createSpy('createDate')
      .and.callFake(arg => withDefault(
        () => new Date(),
        Maybe.of(arg)
          .map(x => new Date(x))));

    const getTimeParamsModule = await mock('source/iml/charting/get-time-params.js', {
      'source/iml/create-date.js': { default: createDate }
    });
    getRequestDuration = getTimeParamsModule.getRequestDuration;

    const mod = await mock('source/iml/host-cpu-ram-chart/get-host-cpu-ram-stream.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    getHostCpuRamStream = mod.default;

    jasmine.clock().install();
  }, 10000);

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  var fixtures, spy;

  afterEach(resetAll);

  beforeEach(() => {
    spy = jasmine.createSpy('spy');

    fixtures = hostCpuRamDataFixtures;
  });

  it('should return a factory function', () => {
    expect(getHostCpuRamStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    var hostCpuRamStream;

    beforeEach(() => {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration({}, 10, 'minutes');

      hostCpuRamStream = getHostCpuRamStream(requestDuration, buff);

      hostCpuRamStream
        .through(convertNvDates)
        .each(spy);
    });

    describe('when there is data', () => {
      beforeEach(() => {
        serverStream.write(fixtures[0].in);
        serverStream.end();
        jasmine.clock().tick(10000);
      });

      it('should return a stream', () => {
        expect(highland.isStream(hostCpuRamStream)).toBe(true);
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
        serverStream.write(fixtures[0].in[0]);
        serverStream.end();
        jasmine.clock().tick(10000);

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
