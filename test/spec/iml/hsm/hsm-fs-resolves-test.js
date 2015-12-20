import angular from 'angular';
const {module, inject} = angular.mock;

describe('hsm fs resolve', function () {

  var socketStream, s, resolveStream, fsCollStream, copytoolStream, addProperty, $q, $rootScope;

  beforeEach(module('hsmFs', function ($provide) {
    s = highland();
    socketStream = jasmine.createSpy('socketStream')
      .andReturn(s);
    $provide.value('socketStream', socketStream);

    resolveStream = jasmine.createSpy('resolveStream');
    $provide.value('resolveStream', resolveStream);

    addProperty = jasmine.createSpy('addProperty');
    $provide.value('addProperty', addProperty);
  }));

  beforeEach(inject(function (_fsCollStream_, _copytoolStream_, _$q_, _$rootScope_) {
    fsCollStream = _fsCollStream_;
    copytoolStream = _copytoolStream_;
    $q = _$q_;
    $rootScope = _$rootScope_;

    resolveStream.andReturn($q.when(s));
  }));

  describe('fsCollStream', function () {

    var result;
    beforeEach(function () {
      result = fsCollStream();
      $rootScope.$digest();
    });

    it('should invoe socketStream with a call to filesystem', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/filesystem', {
        jsonMask: 'objects(id,label,cdt_status,hsm_control_params,locks)'
      });
    });

    it('should resolve the stream', function () {
      expect(resolveStream).toHaveBeenCalledOnceWith(s);
    });

    it('should send the stream through addProperty', function () {
      expect(addProperty).toHaveBeenCalledOnce();
    });
  });

  describe('copytoolStream', function () {
    var result;

    beforeEach(function () {
      result = copytoolStream();
    });

    it('should invoke the socket stream', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/copytool', {
        jsonMask: 'objects(id)'
      });
    });

    it('should invoke resolveStream with the socket stream', function () {
      expect(resolveStream).toHaveBeenCalledOnceWith(s);
    });
  });

});
