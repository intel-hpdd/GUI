import highland from 'highland';
import moment from 'moment';
import hostCpuRamDataFixtures from
  '../../../data-fixtures/host-cpu-ram-data-fixtures';
import hostCpuRamChartModule from
'../../../../source/iml/host-cpu-ram-chart/host-cpu-ram-chart-module';

describe('The host cpu ram stream', () => {
  var socketStream, serverStream, getServerMoment;

  beforeEach(module(hostCpuRamChartModule, $provide => {
    socketStream = jasmine.createSpy('socketStream')
      .and.callFake(() => (serverStream = highland()));

    $provide.value('socketStream', socketStream);

    getServerMoment = jasmine.createSpy('getServerMoment')
      .and.returnValue(moment('2013-11-18T20:59:30+00:00'));

    $provide.value('getServerMoment', getServerMoment);
  }));

  var getHostCpuRamStream, fixtures, spy, revert;

  beforeEach(inject(_getHostCpuRamStream_ => {
    spy = jasmine.createSpy('spy');

    getHostCpuRamStream = _getHostCpuRamStream_;

    fixtures = hostCpuRamDataFixtures;

    revert = patchRateLimit();
  }));

  afterEach(() => {
    revert();
  });

  it('should return a factory function', () => {
    expect(getHostCpuRamStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    var hostCpuRamStream;

    beforeEach(inject((getRequestDuration, bufferDataNewerThan) => {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration({}, 10, 'minutes');

      hostCpuRamStream = getHostCpuRamStream(requestDuration, buff);

      hostCpuRamStream
        .through(convertNvDates)
        .each(spy);
    }));

    describe('when there is data', () => {
      beforeEach(() => {
        serverStream.write(fixtures[0].in);
        serverStream.end();
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
