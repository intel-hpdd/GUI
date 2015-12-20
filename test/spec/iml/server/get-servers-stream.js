import angular from 'angular';
const {module, inject} = angular.mock;

describe('servers stream', function () {
  var socketStream, CACHE_INITIAL_DATA, stream;

  beforeEach(module('server', function ($provide) {
    CACHE_INITIAL_DATA = { host: [] };

    $provide.constant('CACHE_INITIAL_DATA', CACHE_INITIAL_DATA);

    socketStream = jasmine.createSpy('socketStream');

    $provide.value('socketStream', socketStream);

    $provide.decorator('socketStream', function (λ, $delegate) {
      'ngInject';

      return $delegate.andCallFake(function () {
        stream = λ();

        return stream;
      });
    });
  }));

  var getServersStream, serversStream;

  beforeEach(inject(function (_getServersStream_) {
    getServersStream = _getServersStream_;
    serversStream = getServersStream();
  }));

  it('should get the stream', function () {
    expect(socketStream).toHaveBeenCalledOnce();
  });

  it('should return a stream', function () {
    expect(highland.isStream(serversStream)).toBe(true);
  });

  it('should request a list of hosts', function () {
    expect(socketStream).toHaveBeenCalledOnceWith('/host', {
      jsonMask: 'objects(id,address,available_actions,boot_time,fqdn,immutable_state,install_method,label,locks\
,member_of_active_filesystem,nodename,resource_uri,server_profile/ui_name,state)',
      qs: { limit: 0 }
    });
  });

  it('should receive the initial data', function () {
    serversStream.each(function (x) {
      expect(x).toEqual({ objects: [] });
    });
  });

  it('should have a destroy method', function () {
    serversStream.pull(_.noop);

    serversStream.destroy();

    stream.pull(function (err, x) {
      expect(x).toBe(nil);
    });
  });

  describe('receiving subsequent data', function () {
    beforeEach(function () {
      stream.write({ objects: [{ id: 1 }] });
    });

    it('should receive server data', function () {
      serversStream.pull(_.noop);

      serversStream.each(function (x) {
        expect(x).toEqual({ objects: [{ id: 1 }] });
      });
    });

    it('should remember the last data written', function () {
      serversStream.pull(_.noop);
      serversStream.pull(_.noop);

      serversStream = getServersStream();

      serversStream.pull(function (err, x) {
        expect(x).toEqual({ objects: [ {id: 1} ] });
      });
    });
  });
});
