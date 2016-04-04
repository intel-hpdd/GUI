import highland from 'highland';
import serverModule from '../../../../source/iml/server/server-module';

describe('server resolves', () => {
  var socketStream, getStore, lnetStream;

  beforeEach(module(serverModule, $provide => {
    getStore = {
      select: jasmine.createSpy('select')
        .and.callFake(() => highland())
    };
    $provide.value('getStore', getStore);

    socketStream = jasmine.createSpy('socketStream')
      .and.callFake((path) => {
        if (path === '/lnet_configuration')
          return (lnetStream = highland());
      });
    $provide.value('socketStream', socketStream);
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
      lnetStream.write({
        objects: []
      });

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
      expect(socketStream).toHaveBeenCalledOnceWith('/lnet_configuration', {
        jsonMask: 'objects(state,host,resource_uri)',
        qs: {
          dehydrate__host: false
        }
      });
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
