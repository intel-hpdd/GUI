import highland from 'highland';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('dashboard resolves', () => {
  let s, spy, store, broadcaster, mod;

  beforeEachAsync(async function () {
    spy = jasmine.createSpy('spy');
    s = highland();

    broadcaster = jasmine.createSpy('broadcaster')
      .and
      .callFake(x => () => x);

    store = {
      select: jasmine
        .createSpy('select')
        .and
        .returnValue(s)
    };

    mod = await mock('source/iml/dashboard/dashboard-resolves.js', {
      'source/iml/store/get-store.js': {
        default: store
      },
      'source/iml/broadcaster.js': {
        default: broadcaster
      }
    });
  });

  afterEach(resetAll);

  describe('fs stream', () => {
    let fsStream;

    beforeEach(() => {
      fsStream = mod.dashboardFsB()();
    });

    it('should be a broadcaster', () => {
      expect(broadcaster)
        .toHaveBeenCalledOnce();
    });

    it('should select from the store', () => {
      expect(store.select)
        .toHaveBeenCalledOnceWith('fileSystems');
    });

    it('should stream data', () => {
      s.write(['foo']);

      fsStream.each(spy);

      expect(spy)
        .toHaveBeenCalledOnceWith(['foo']);
    });
  });

  describe('host stream', () => {
    let hostStream;

    beforeEach(() => {
      hostStream = mod.dashboardHostB()();
    });

    it('should be a broadcaster', () => {
      expect(broadcaster)
        .toHaveBeenCalledOnce();
    });

    it('should select from the store', () => {
      expect(store.select)
        .toHaveBeenCalledOnceWith('server');
    });


    it('should stream data', () => {
      s.write(['foo']);

      hostStream.each(spy);

      expect(spy)
        .toHaveBeenCalledOnceWith(['foo']);
    });
  });

  describe('target stream', () => {
    let targetStream;

    beforeEach(() => {
      targetStream = mod.dashboardTargetB()();
    });

    it('should be a broadcaster', () => {
      expect(broadcaster)
        .toHaveBeenCalledOnce();
    });

    it('should select from the store', () => {
      expect(store.select)
        .toHaveBeenCalledOnceWith('targets');
    });


    it('should stream data', () => {
      s.write(['foo']);

      targetStream.each(spy);

      expect(spy)
        .toHaveBeenCalledOnceWith(['foo']);
    });
  });
});
