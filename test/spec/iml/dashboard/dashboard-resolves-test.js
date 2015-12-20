import angular from 'angular';
const {module, inject} = angular.mock;

describe('dashboard resolves', function () {
  'use strict';

  var resolveStream, socketStream, s, addProperty, $q;

  beforeEach(module('dashboard', function ($provide) {
    s = highland();

    resolveStream = jasmine.createSpy('resolveStream');
    $provide.value('resolveStream', resolveStream);

    socketStream = jasmine.createSpy('socketStream')
      .andReturn(s);
    $provide.value('socketStream', socketStream);

    addProperty = jasmine.createSpy('addProperty')
      .andCallFake(fp.identity);
    $provide.value('addProperty', addProperty);
  }));

  var $rootScope;

  beforeEach(inject(function (_$rootScope_, _$q_) {
    $rootScope = _$rootScope_;
    $q = _$q_;

    resolveStream.andReturn($q.when(s));
  }));

  describe('fs stream', function () {
    var dashboardFsStream, promise;

    beforeEach(inject(function (_dashboardFsStream_) {
      dashboardFsStream = _dashboardFsStream_;
      promise = dashboardFsStream();
    }));

    it('should be a function', function () {
      expect(dashboardFsStream).toEqual(jasmine.any(Function));
    });

    it('should addProperty', function () {
      promise.then(function (s) {
        s.each(fp.noop);
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

    beforeEach(inject(function (_dashboardHostStream_) {
      dashboardHostStream = _dashboardHostStream_;

      promise = dashboardHostStream();
    }));

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
        s.each(fp.noop);
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

    beforeEach(inject(function (_dashboardTargetStream_) {
      dashboardTargetStream = _dashboardTargetStream_;

      promise = dashboardTargetStream();
    }));

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
        s.each(fp.noop);
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
