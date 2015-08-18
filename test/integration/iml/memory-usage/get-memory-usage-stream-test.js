describe('The memory usage stream', function () {
  'use strict';

  var socketStream, serverStream, getServerMoment;

  beforeEach(module('memoryUsageModule', 'dataFixtures', function ($provide) {
    socketStream = jasmine.createSpy('socketStream')
      .andCallFake(function () {
        return (serverStream = highland());
      });

    $provide.value('socketStream', socketStream);

    getServerMoment = jasmine.createSpy('getServerMoment')
      .andReturn(moment('2014-04-14T13:23:00.000Z'));

    $provide.value('getServerMoment', getServerMoment);
  }));

  var getMemoryUsageStream, fixtures, spy, revert;

  beforeEach(inject(function (_getMemoryUsageStream_, memoryUsageDataFixtures) {
    spy = jasmine.createSpy('spy');

    getMemoryUsageStream = _getMemoryUsageStream_;

    fixtures = memoryUsageDataFixtures;

    revert = patchRateLimit();
  }));

  afterEach(function () {
    revert();
  });

  it('should return a factory function', function () {
    expect(getMemoryUsageStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', function () {
    var memoryUsageStream;

    beforeEach(inject(function (getRequestDuration, bufferDataNewerThan) {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration(10, 'minutes');

      memoryUsageStream = getMemoryUsageStream(requestDuration, buff);

      memoryUsageStream
        .through(convertNvDates)
        .each(spy);
    }));

    describe('when there is data', function () {
      beforeEach(function () {
        serverStream.write(fixtures[0].in);
        serverStream.end();
      });

      it('should return a stream', function () {
        expect(highland.isStream(memoryUsageStream)).toBe(true);
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

      it('should populate if data comes in on next tick', function () {
        serverStream.write(fixtures[0].in[0]);
        serverStream.end();

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
