import angular from 'angular';
const {module, inject} = angular.mock;

describe('The read write bandwidth stream', () => {
  var socketStream, serverStream, getServerMoment;

  beforeEach(module('readWriteBandwidth', 'dataFixtures', ($provide) => {
    socketStream = jasmine.createSpy('socketStream')
      .andCallFake(() => {
        return (serverStream = highland());
      });

    $provide.value('socketStream', socketStream);

    getServerMoment = jasmine.createSpy('getServerMoment')
      .andReturn(moment('2013-12-11T13:15:00+00:00'));

    $provide.value('getServerMoment', getServerMoment);
  }));

  var getReadWriteBandwidthStream, fixtures, spy, revert;

  beforeEach(inject((_getReadWriteBandwidthStream_, readWriteBandwidthDataFixtures) => {
    spy = jasmine.createSpy('spy');

    getReadWriteBandwidthStream = _getReadWriteBandwidthStream_;

    fixtures = readWriteBandwidthDataFixtures;

    revert = patchRateLimit();
  }));

  afterEach(() => {
    revert();
  });

  it('should return a factory function', () => {
    expect(getReadWriteBandwidthStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    var readWriteBandwidthStream;

    beforeEach(inject((getRequestDuration, bufferDataNewerThan) => {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration({}, 10, 'minutes');

      readWriteBandwidthStream = getReadWriteBandwidthStream(requestDuration, buff);

      readWriteBandwidthStream
        .through(convertNvDates)
        .each(spy);
    }));

    describe('when there is data', () => {
      beforeEach(() => {
        serverStream.write(fixtures[0].in);
        serverStream.end();
      });

      it('should return a stream', () => {
        expect(highland.isStream(readWriteBandwidthStream)).toBe(true);
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
            key: 'read',
            values: []
          },
          {
            key: 'write',
            values: []
          }
        ]);
      });

      it('should populate if data comes in on next tick', () => {
        serverStream.write(fixtures[0].in[0]);
        serverStream.end();

        expect(spy).toHaveBeenCalledOnceWith([
          {
            key: 'read',
            values: [
              { x: '2013-12-11T13:15:00.000Z', y: 106772238984.1 }
            ]
          },
          { key: 'write',
            values: [
              { x: '2013-12-11T13:15:00.000Z', y: -104418696882.20003 }
            ]
          }
        ]);
      });
    });
  });
});
