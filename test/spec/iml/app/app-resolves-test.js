import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('app resolves', () => {
  var socketStream, resolveStream,
    promise, stream, appModule, CACHE_INITIAL_DATA;

  beforeEachAsync(async function () {
    promise = {};
    resolveStream = jasmine.createSpy('resolveStream');
    resolveStream.and.returnValue(promise);

    stream = {};
    socketStream = jasmine.createSpy('socketStream');
    socketStream.and.returnValue(stream);

    CACHE_INITIAL_DATA = {
      session: {}
    };

    appModule = await mock('source/iml/app/app-resolves.js', {
      'source/iml/resolve-stream.js': { default: resolveStream },
      'source/iml/socket/socket-stream.js': { default: socketStream },
      'source/iml/environment.js': { CACHE_INITIAL_DATA }
    });
  });

  afterEach(resetAll);

  describe('app alert stream', () => {
    var result;

    beforeEach(() => {
      result = appModule.alertStream();
    });

    it('should return a promise', () => {
      expect(result).toBe(promise);
    });

    it('should create a socket connection', () => {
      expect(socketStream).toHaveBeenCalledOnceWith('/alert/', {
        jsonMask: 'objects(message)',
        qs: {
          severity__in: ['WARNING', 'ERROR'],
          limit: 0,
          active: true
        }
      });
    });
  });

  describe('app notification stream', () => {
    var result;

    beforeEach(() => {
      result = appModule.appNotificationStream();
    });

    it('should return a promise', () => {
      expect(result).toBe(promise);
    });

    it('should create a socket connection', () => {
      expect(socketStream).toHaveBeenCalledOnceWith('/health');
    });

    it('should call resolveStream with a stream', () => {
      expect(resolveStream).toHaveBeenCalledOnceWith(stream);
    });
  });

  describe('app session', () => {
    var appSession, SessionModel,
      session;

    beforeEach(() => {
      session = {};
      SessionModel = jasmine
        .createSpy('SessionModel')
        .and
        .returnValue(session);

      appSession = appModule.appSessionFactory(SessionModel);
    });

    it('should return the session', () => {
      expect(appSession).toBe(session);
    });

    it('should call the session with initial data', () => {
      expect(SessionModel).toHaveBeenCalledOnceWith(CACHE_INITIAL_DATA.session);
    });
  });
});
