describe('file usage stream', () => {
  var socketStream, serverStream, getServerMoment;

  beforeEach(window.module('fileUsageModule', 'dataFixtures', ($provide) => {
    socketStream = jasmine.createSpy('socketStream')
      .andCallFake(() => {
        return (serverStream = highland());
      });

    $provide.value('socketStream', socketStream);

    getServerMoment = jasmine.createSpy('getServerMoment')
      .andReturn(moment('2014-04-14T13:40:00+00:00'));

    $provide.value('getServerMoment', getServerMoment);
  }));

  var getFileUsageStream, fixtures, spy, revert;

  beforeEach(inject((_getFileUsageStream_, fileUsageDataFixtures) => {
    spy = jasmine.createSpy('spy');

    getFileUsageStream = _getFileUsageStream_;

    fixtures = fileUsageDataFixtures;

    revert = patchRateLimit();
  }));

  afterEach(() => {
    revert();
  });

  it('should return a factory function', () => {
    expect(getFileUsageStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    var fileUsageStream;

    beforeEach(inject((getRequestDuration, bufferDataNewerThan) => {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration({}, 10, 'minutes');

      fileUsageStream = getFileUsageStream('Files Used', requestDuration, buff);

      fileUsageStream
        .through(convertNvDates)
        .each(spy);
    }));

    describe('when there is data', () => {
      beforeEach(() => {
        serverStream.write(fixtures[0].in);
        serverStream.end();
      });

      it('should return a stream', () => {
        expect(highland.isStream(fileUsageStream)).toBe(true);
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
            key: 'Files Used',
            values: []
          }
        ]);
      });

      it('should populate if data comes in on next tick', () => {
        serverStream.write(fixtures[0].in[0]);
        serverStream.end();

        expect(spy).toHaveBeenCalledOnceWith([
          {
            key: 'Files Used',
            values: [
              {
                x: '2014-04-14T13:39:40.000Z',
                y: 0.656037109375
              }
            ]
          }
        ]);
      });
    });
  });
});
