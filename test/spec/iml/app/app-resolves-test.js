describe('app resolves', () => {
  let mockSocketStream, mockResolveStream, promise, stream, appModule, mockCacheInitialData;
  beforeEach(() => {
    promise = {};
    mockResolveStream = jest.fn();
    mockResolveStream.mockReturnValue(promise);
    stream = {};
    mockSocketStream = jest.fn();
    mockSocketStream.mockReturnValue(stream);
    mockCacheInitialData = { session: {} };
    appModule = jest.mock('../../../../source/iml/promise-transforms.js', () => ({
      resolveStream: mockResolveStream
    }));
    jest.mock('../../../../source/iml/socket/socket-stream.js', () => mockSocketStream);
    jest.mock('../../../../source/iml/environment.js', () => ({
      CACHE_INITIAL_DATA: mockCacheInitialData
    }));

    appModule = require('../../../../source/iml/app/app-resolves.js');
  });

  describe('app alert stream', () => {
    let result;
    beforeEach(() => {
      result = appModule.alertStream();
    });
    it('should return a promise', () => {
      expect(result).toBe(promise);
    });
    it('should create a socket connection', () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith('/alert/', {
        jsonMask: 'objects(message)',
        qs: { severity__in: ['WARNING', 'ERROR'], limit: 0, active: true }
      });
    });
  });
  describe('app notification stream', () => {
    let result;
    beforeEach(() => {
      result = appModule.appNotificationStream();
    });
    it('should return a promise', () => {
      expect(result).toBe(promise);
    });
    it('should create a socket connection', () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith('/health');
    });
    it('should call resolveStream with a stream', () => {
      expect(mockResolveStream).toHaveBeenCalledOnceWith(stream);
    });
  });
  describe('app session', () => {
    let appSession;
    beforeEach(() => {
      appSession = appModule.appSessionFactory();
    });
    it('should return the session', () => {
      expect(appSession).toBe(mockCacheInitialData.session);
    });
  });
});
