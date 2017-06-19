import highland from 'highland';

describe('dashboard resolves', () => {
  let s, spy, mockStore, mockBroadcaster, mod;

  beforeEach(() => {

    spy = jest.fn();
    s = highland();

    mockBroadcaster = jest.fn(x => () => x);

    mockStore = {
      select: jest.fn(() => s)
    };

    jest.mock('../../../../source/iml/store/get-store.js', () => mockStore);
    jest.mock('../../../../source/iml/broadcaster.js', () => mockBroadcaster);

    mod = require('../../../../source/iml/dashboard/dashboard-resolves.js');
  });

  describe('fs stream', () => {
    let fsStream;

    beforeEach(() => {
      fsStream = mod.dashboardFsB()();
    });

    it('should be a broadcaster', () => {
      expect(mockBroadcaster).toHaveBeenCalledTimes(1);
    });

    it('should select from the store', () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith('fileSystems');
    });

    it('should stream data', () => {
      s.write(['foo']);

      fsStream.each(spy);

      expect(spy).toHaveBeenCalledOnceWith(['foo']);
    });
  });

  describe('host stream', () => {
    let hostStream;

    beforeEach(() => {
      hostStream = mod.dashboardHostB()();
    });

    it('should be a broadcaster', () => {
      expect(mockBroadcaster).toHaveBeenCalledTimes(1);
    });

    it('should select from the store', () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith('server');
    });

    it('should stream data', () => {
      s.write(['foo']);

      hostStream.each(spy);

      expect(spy).toHaveBeenCalledOnceWith(['foo']);
    });
  });

  describe('target stream', () => {
    let targetStream;

    beforeEach(() => {
      targetStream = mod.dashboardTargetB()();
    });

    it('should be a broadcaster', () => {
      expect(mockBroadcaster).toHaveBeenCalledTimes(1);
    });

    it('should select from the store', () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith('targets');
    });

    it('should stream data', () => {
      s.write(['foo']);

      targetStream.each(spy);

      expect(spy).toHaveBeenCalledOnceWith(['foo']);
    });
  });
});
