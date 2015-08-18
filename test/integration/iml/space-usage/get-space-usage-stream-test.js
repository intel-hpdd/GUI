describe('space usage stream', function () {
  'use strict';

  var socketStream, serverStream, getServerMoment;

  beforeEach(module('spaceUsageModule', 'dataFixtures', function ($provide) {
    socketStream = jasmine.createSpy('socketStream')
      .andCallFake(function () {
        return (serverStream = highland());
      });

    $provide.value('socketStream', socketStream);

    getServerMoment = jasmine.createSpy('getServerMoment')
      .andReturn(moment('2014-04-14T13:12:00+00:00'));

    $provide.value('getServerMoment', getServerMoment);
  }));

  var getSpaceUsageStream, fixtures, spy, revert;


  beforeEach(inject(function (_getSpaceUsageStream_, spaceUsageDataFixtures) {
    spy = jasmine.createSpy('spy');

    getSpaceUsageStream = _getSpaceUsageStream_;

    fixtures = spaceUsageDataFixtures;

    revert = patchRateLimit();
  }));

  afterEach(function () {
    revert();
  });

  it('should return a factory function', function () {
    expect(getSpaceUsageStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', function () {
    var spaceUsageStream;

    beforeEach(inject(function (getRequestDuration, bufferDataNewerThan) {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration(10, 'minutes');

      spaceUsageStream = getSpaceUsageStream(requestDuration, buff);

      spaceUsageStream
        .through(convertNvDates)
        .each(spy);
    }));

    describe('when there is data', function () {
      beforeEach(function () {
        serverStream.write(fixtures[0].in);
        serverStream.end();
      });

      it('should return a stream', function () {
        expect(highland.isStream(spaceUsageStream)).toBe(true);
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
            key: 'Space Used',
            values: []
          }
        ]);
      });

      it('should populate if data comes in on next tick', function () {
        serverStream.write(fixtures[0].in[0]);
        serverStream.end();

        expect(spy).toHaveBeenCalledOnceWith([
          {
            key: 'Space Used',
            values: [
              {
                x: '2014-04-14T13:11:50.000Z',
                y: 0.6627046805673511
              }
            ]
          }
        ]);
      });
    });
  });
});
