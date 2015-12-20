import angular from 'angular';
const {module, inject} = angular.mock;

describe('get cpu usage stream', () => {
  var socketStream, serverStream, getServerMoment;

  beforeEach(module('cpuUsageModule', 'dataFixtures', ($provide) => {
    socketStream = jasmine.createSpy('socketStream')
      .andCallFake(() => {
        return (serverStream = highland());
      });

    $provide.value('socketStream', socketStream);

    getServerMoment = jasmine.createSpy('getServerMoment')
      .andReturn(moment('2014-04-11T01:18:00+00:00'));

    $provide.value('getServerMoment', getServerMoment);
  }));

  var getCpuUsageStream, fixtures, revert, spy;

  beforeEach(inject((_getCpuUsageStream_, cpuUsageDataFixtures) => {
    getCpuUsageStream = _getCpuUsageStream_;

    spy = jasmine.createSpy('spy');

    fixtures = cpuUsageDataFixtures;

    revert = patchRateLimit();
  }));

  afterEach(() => {
    revert();
  });

  it('should return a factory function', () => {
    expect(getCpuUsageStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    var cpuUsageStream;

    beforeEach(inject((getRequestDuration, bufferDataNewerThan) => {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration({}, 10, 'minutes');

      cpuUsageStream = getCpuUsageStream(requestDuration, buff);

      cpuUsageStream
        .through(convertNvDates)
        .each(spy);
    }));

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
