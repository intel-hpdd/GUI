import highland from 'highland';
import {identity, noop} from 'intel-fp';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('dashboard resolves', function () {
  var resolveStream, socketStream, s, addProperty, $q, $rootScope, mod;

  beforeEachAsync(async function () {
    s = highland();

    resolveStream = jasmine.createSpy('resolveStream');

    socketStream = jasmine.createSpy('socketStream')
      .and.returnValue(s);

    addProperty = jasmine.createSpy('addProperty')
      .and.callFake(identity);

    mod = await mock('source/iml/dashboard/dashboard-resolves.js', {
      'source/iml/resolve-stream.js': { default: resolveStream },
      'source/iml/socket/socket-stream.js': { default: socketStream },
      'source/iml/highland/add-property.js': { default: addProperty }
    });
  });

  afterEach(resetAll);

  beforeEach(inject(function (_$rootScope_, _$q_) {
    $rootScope = _$rootScope_;
    $q = _$q_;

    resolveStream.and.returnValue($q.when(s));
  }));

  describe('fs stream', function () {
    var dashboardFsStream, promise;

    beforeEach(() => {
      dashboardFsStream = mod.dashboardFsStream;
      promise = dashboardFsStream();
    });

    it('should be a function', function () {
      expect(dashboardFsStream).toEqual(jasmine.any(Function));
    });

    it('should addProperty', function () {
      promise.then(function (s) {
        s.each(noop);
      });

      s.write({
        objects: ['foo']
      });
      $rootScope.$apply();

      expect(addProperty).toHaveBeenCalledOnce();
    });

    it('should call socketStream', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/filesystem', {
        jsonMask: 'objects(id,label)',
        qs: {
          limit: 0
        }
      });
    });

    it('should stream data', function () {
      var result;

      promise.then(function (s) {
        s.each(function (x) {
          result = x;
        });
      });

      s.write({
        objects: ['foo']
      });
      $rootScope.$apply();

      expect(result).toEqual(['foo']);
    });
  });

  describe('host stream', function () {
    var dashboardHostStream, promise;

    beforeEach(() => {
      dashboardHostStream = mod.dashboardHostStream;

      promise = dashboardHostStream();
    });

    it('should be a function', function () {
      expect(dashboardHostStream).toEqual(jasmine.any(Function));
    });

    it('should call socketStream', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/host', {
        jsonMask: 'objects(id,label)',
        qs: {
          limit: 0
        }
      });
    });

    it('should addProperty', function () {
      promise.then(function (s) {
        s.each(noop);
      });

      s.write('foo');
      $rootScope.$apply();

      expect(addProperty).toHaveBeenCalledOnce();
    });

    it('should stream data', function () {
      var result;

      promise.then(function (s) {
        s.each(function (x) {
          result = x;
        });
      });

      s.write('foo');
      $rootScope.$apply();

      expect(result).toEqual('foo');
    });
  });

  describe('target stream', function () {
    var dashboardTargetStream, promise;

    beforeEach(() => {
      dashboardTargetStream = mod.dashboardTargetStream;

      promise = dashboardTargetStream();
    });

    it('should be a function', function () {
      expect(dashboardTargetStream).toEqual(jasmine.any(Function));
    });

    it('should call socketStream', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/target', {
        jsonMask: 'objects(id,label,kind,filesystems,filesystem_id,failover_servers,primary_server)',
        qs: {
          limit: 0
        }
      });
    });

    it('should addProperty', function () {
      promise.then(function (s) {
        s.each(noop);
      });

      s.write('foo');
      $rootScope.$apply();

      expect(addProperty).toHaveBeenCalledOnce();
    });

    it('should stream data', function () {
      var result;

      promise.then(function (s) {
        s.each(function (x) {
          result = x;
        });
      });

      s.write('foo');
      $rootScope.$apply();

      expect(result).toEqual('foo');
    });
  });
});
