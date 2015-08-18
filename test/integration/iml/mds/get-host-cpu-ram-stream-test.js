describe('The host cpu ram stream', function () {
  'use strict';

  var socketStream, serverStream, getServerMoment;

  beforeEach(module('hostCpuRamChart', 'dataFixtures', function ($provide) {
    socketStream = jasmine.createSpy('socketStream')
      .andCallFake(function () {
        return (serverStream = highland());
      });

    $provide.value('socketStream', socketStream);

    getServerMoment = jasmine.createSpy('getServerMoment')
      .andReturn(moment('2013-11-18T20:59:30+00:00'));

    $provide.value('getServerMoment', getServerMoment);
  }));

  var getHostCpuRamStream, fixtures, spy, revert;

  beforeEach(inject(function (_getHostCpuRamStream_, hostCpuRamDataFixtures) {
    spy = jasmine.createSpy('spy');

    getHostCpuRamStream = _getHostCpuRamStream_;

    fixtures = hostCpuRamDataFixtures;

    revert = patchRateLimit();
  }));

  afterEach(function () {
    revert();
  });

  it('should return a factory function', function () {
    expect(getHostCpuRamStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', function () {
    var hostCpuRamStream;

    beforeEach(inject(function (getRequestDuration, bufferDataNewerThan) {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration(10, 'minutes');

      hostCpuRamStream = getHostCpuRamStream(requestDuration, buff);

      hostCpuRamStream
        .through(convertNvDates)
        .each(spy);
    }));

    describe('when there is data', function () {
      beforeEach(function () {
        serverStream.write(fixtures[0].in);
        serverStream.end();
      });

      it('should return a stream', function () {
        expect(highland.isStream(hostCpuRamStream)).toBe(true);
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
            key: 'cpu',
            values: []
          },
          {
            key: 'ram',
            values: []
          }
        ]);
      });

      it('should populate if data comes in on next tick', function () {
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
