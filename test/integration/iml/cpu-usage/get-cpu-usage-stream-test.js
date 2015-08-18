describe('get cpu usage stream', function () {
  'use strict';

  var socketStream, serverStream, getServerMoment;

  beforeEach(module('cpuUsageModule', 'dataFixtures', function ($provide) {
    socketStream = jasmine.createSpy('socketStream')
      .andCallFake(function () {
        return (serverStream = highland());
      });

    $provide.value('socketStream', socketStream);

    getServerMoment = jasmine.createSpy('getServerMoment')
      .andReturn(moment('2014-04-11T01:18:00+00:00'));

    $provide.value('getServerMoment', getServerMoment);
  }));

  var getCpuUsageStream, fixtures, revert, spy;

  beforeEach(inject(function (_getCpuUsageStream_, cpuUsageDataFixtures) {
    getCpuUsageStream = _getCpuUsageStream_;

    spy = jasmine.createSpy('spy');

    fixtures = cpuUsageDataFixtures;

    revert = patchRateLimit();
  }));

  afterEach(function () {
    revert();
  });

  it('should return a factory function', function () {
    expect(getCpuUsageStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', function () {
    var cpuUsageStream;

    beforeEach(inject(function (getRequestDuration, bufferDataNewerThan) {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration(10, 'minutes');

      cpuUsageStream = getCpuUsageStream(requestDuration, buff);

      cpuUsageStream
        .through(convertNvDates)
        .each(spy);
    }));

    describe('when there is data', function () {
      beforeEach(function () {
        serverStream.write(fixtures[0].in);
        serverStream.end();
      });

      it('should return a stream', function () {
        expect(highland.isStream(cpuUsageStream)).toBe(true);
      });

      it('should return computed data', function () {
        expect(spy).toHaveBeenCalledOnceWith(fixtures[0].out);
      });

      it('should drop duplicate values', function () {
        serverStream.write(fixtures[0].in[0]);
        serverStream.end();

        expect(spy).toHaveBeenCalledTwiceWith(fixtures[0].out);
      });
    });

    describe('when there is no initial data', function () {
      beforeEach(function () {
        serverStream.write([]);
        serverStream.end();
      });

      it('should return an empty nvd3 structure', function () {
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

      it('should populate if data comes in on next tick', function () {
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
