import highland from 'highland';
import serverModule from '../../../../source/iml/server/server-module';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('server resolves', () => {
  let store, resolvesModule;

  beforeEachAsync(async function () {
    store = {
      select: jasmine.createSpy('select')
        .and.callFake(() => highland())
    };

    resolvesModule = await mock('source/iml/server/server-resolves.js', {
      'source/iml/store/get-store': { default: store }
    });
  });

  afterEach(resetAll);

  beforeEach(module(serverModule, $provide => {
    $provide.factory('serverResolves', resolvesModule.default);
  }));

  var serverResolves;

  beforeEach(inject(_serverResolves_ => {
    serverResolves = _serverResolves_;
  }));

  it('should be a function', () => {
    expect(serverResolves).toEqual(jasmine.any(Function));
  });

  describe('getting a promise', () => {
    var promise;

    beforeEach(() => {
      promise = serverResolves();
    });

    it('should create a jobMonitorStream', () => {
      expect(store.select).toHaveBeenCalledOnceWith('jobIndicators');
    });

    it('should create an alertMonitorStream', () => {
      expect(store.select).toHaveBeenCalledOnceWith('alertIndicators');
    });

    it('should create a servers stream', () => {
      expect(store.select).toHaveBeenCalledOnceWith('server');
    });

    it('should create a lnet configuration stream', () => {
      expect(store.select).toHaveBeenCalledOnceWith('lnetConfiguration');
    });

    itAsync('should return an object of streams', async function () {
      const result = await promise;


      expect(result)
        .toEqual({
          jobMonitorStream: jasmine.any(Function),
          alertMonitorStream: jasmine.any(Function),
          lnetConfigurationStream: jasmine.any(Function),
          serversStream: jasmine.any(Object)
        });
    });
  });
});
