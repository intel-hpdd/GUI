describe('app resolves', function () {
  var resolveStream, socketStream, promise, stream;

  beforeEach(module('app', function ($provide) {
    promise = {};
    resolveStream = jasmine.createSpy('resolveStream');
    resolveStream.andReturn(promise);
    $provide.value('resolveStream', resolveStream);

    stream = {};
    socketStream = jasmine.createSpy('socketStream');
    socketStream.andReturn(stream);
    $provide.value('socketStream', socketStream);
  }));

  describe('app alert stream', function () {
    var appAlertStream;

    beforeEach(inject(function (_appAlertStream_) {
      appAlertStream = _appAlertStream_;
    }));

    it('should return a function', function () {
      expect(appAlertStream).toEqual(jasmine.any(Function));
    });

    describe('when invoked', function () {
      var result;

      beforeEach(function () {
        result = appAlertStream();
      });

      it('should return a promise', function () {
        expect(result).toBe(promise);
      });

      it('should create a socket connection', function () {
        expect(socketStream).toHaveBeenCalledOnceWith('/alert/', {
          jsonMask: 'objects(message)',
          qs: {
            severity__in: ['WARNING', 'ERROR'],
            limit: 0,
            active: true
          }
        });
      });

      it('should call resolveStream with a stream', function () {
        expect(resolveStream).toHaveBeenCalledOnceWith(stream);
      });
    });
  });

  describe('app notification stream', function () {
    var appNotificationStream;

    beforeEach(inject(function (_appNotificationStream_) {
      appNotificationStream = _appNotificationStream_;
    }));

    it('should return a function', function () {
      expect(appNotificationStream).toEqual(jasmine.any(Function));
    });

    describe('when invoked', function () {
      var result;

      beforeEach(function () {
        result = appNotificationStream();
      });

      it('should return a promise', function () {
        expect(result).toBe(promise);
      });

      it('should create a socket connection', function () {
        expect(socketStream).toHaveBeenCalledOnceWith('/health');
      });

      it('should call resolveStream with a stream', function () {
        expect(resolveStream).toHaveBeenCalledOnceWith(stream);
      });
    });
  });

  describe('app session', function () {
    var appSession, SessionModel,
      session, CACHE_INITIAL_DATA;

    beforeEach(module(function ($provide) {
      session = {};
      SessionModel = jasmine.createSpy('SessionModel')
        .andReturn(session);
      $provide.value('SessionModel', SessionModel);

      CACHE_INITIAL_DATA = {
        session: {}
      };
      $provide.value('CACHE_INITIAL_DATA', CACHE_INITIAL_DATA);
    }));

    beforeEach(inject(function (_appSession_) {
      appSession = _appSession_;
    }));

    it('should return the session', function () {
      expect(appSession).toBe(session);
    });

    it('should call the session with initial data', function () {
      expect(SessionModel).toHaveBeenCalledOnceWith(CACHE_INITIAL_DATA.session);
    });
  });
});
