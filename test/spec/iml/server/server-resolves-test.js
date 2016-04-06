import highland from 'highland';
import serverModule from '../../../../source/iml/server/server-module';

describe('server resolves', () => {
  var getStore;

  beforeEach(module(serverModule, $provide => {
    getStore = {
      select: jasmine.createSpy('select')
        .and.callFake(() => highland())
    };
    $provide.value('getStore', getStore);
  }));

  var serverResolves;

  beforeEach(inject(_serverResolves_ => {
    serverResolves = _serverResolves_;
  }));

  it('should be a function', () => {
    expect(serverResolves).toEqual(jasmine.any(Function));
  });

  describe('getting a promise', () => {
    var $rootScope, promise;

    beforeEach(inject((_$rootScope_) => {
      $rootScope = _$rootScope_;

      promise = serverResolves();

      $rootScope.$apply();
    }));

    it('should create a jobMonitorStream', () => {
      expect(getStore.select).toHaveBeenCalledOnceWith('jobIndicators');
    });

    it('should create an alertMonitorStream', () => {
      expect(getStore.select).toHaveBeenCalledOnceWith('alertIndicators');
    });

    it('should create a servers stream', () => {
      expect(getStore.select).toHaveBeenCalledOnceWith('server');
    });

    it('should create a lnet configuration stream', () => {
      expect(getStore.select).toHaveBeenCalledOnceWith('lnetConfiguration');
    });

    it('should return an object of streams', () => {
      promise.then((streams) => {
        expect(streams).toEqual({
          jobMonitorStream: jasmine.any(Object),
          alertMonitorStream: jasmine.any(Object),
          lnetConfigurationStream: jasmine.any(Object),
          serversStream: jasmine.any(Object)
        });
      });

      $rootScope.$apply();
    });
  });
});
