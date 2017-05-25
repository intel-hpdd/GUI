import highland from 'highland';

describe('server resolves', () => {
  let mockStore, serverResolves;

  beforeEach(() => {
    jest.resetModules();
    mockStore = {
      select: jest.fn(() => highland())
    };

    jest.mock('../../../../source/iml/store/get-store', () => mockStore);

    const mod = require('../../../../source/iml/server/server-resolves.js');

    serverResolves = mod.default;
  });

  it('should be a function', () => {
    expect(serverResolves).toEqual(expect.any(Function));
  });

  describe('getting a promise', () => {
    let promise;

    beforeEach(() => {
      promise = serverResolves();
    });

    it('should create a jobMonitorStream', () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith('jobIndicators');
    });

    it('should create an alertMonitorStream', () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith('alertIndicators');
    });

    it('should create a servers stream', () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith('server');
    });

    it('should create a lnet configuration stream', () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith('lnetConfiguration');
    });

    it('should return an object of streams', async () => {
      const result = await promise;

      expect(result).toEqual({
        jobMonitorStream: expect.any(Function),
        alertMonitorStream: expect.any(Function),
        lnetConfigurationStream: expect.any(Function),
        serversStream: expect.any(Object)
      });
    });
  });
});
