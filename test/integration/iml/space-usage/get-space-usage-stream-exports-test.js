import angular from 'angular';
const {module, inject} = angular.mock;

describe('space usage stream', () => {
  var socketStream, serverStream, getServerMoment;

  beforeEach(module('spaceUsageModule', 'dataFixtures', ($provide) => {
    socketStream = jasmine.createSpy('socketStream')
      .and.callFake(() => {
        return (serverStream = highland());
      });

    $provide.value('socketStream', socketStream);

    getServerMoment = jasmine.createSpy('getServerMoment')
      .and.returnValue(moment('2014-04-14T13:12:00+00:00'));

    $provide.value('getServerMoment', getServerMoment);
  }));

  var getSpaceUsageStream, fixtures, spy, revert;


  beforeEach(inject((_getSpaceUsageStream_, spaceUsageDataFixtures) => {
    spy = jasmine.createSpy('spy');

    getSpaceUsageStream = _getSpaceUsageStream_;

    fixtures = spaceUsageDataFixtures;

    revert = patchRateLimit();
  }));

  afterEach(() => {
    revert();
  });

  it('should return a factory function', () => {
    expect(getSpaceUsageStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    var spaceUsageStream;

    beforeEach(inject((getRequestDuration, bufferDataNewerThan) => {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration({}, 10, 'minutes');

      spaceUsageStream = getSpaceUsageStream(requestDuration, buff);

      spaceUsageStream
        .through(convertNvDates)
        .each(spy);
    }));

    describe('when there is data', () => {
      beforeEach(() => {
        serverStream.write(fixtures[0].in);
        serverStream.end();
      });

      it('should return a stream', () => {
        expect(highland.isStream(spaceUsageStream)).toBe(true);
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
            key: 'Space Used',
            values: []
          }
        ]);
      });

      it('should populate if data comes in on next tick', () => {
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
