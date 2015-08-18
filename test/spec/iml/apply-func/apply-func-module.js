describe('apply func', function () {
  'use strict';

  var $rootScope;

  beforeEach(module('apply-func', function ($provide) {
    $rootScope = {
      $apply: jasmine.createSpy('$apply').andCallFake(function (apply) {
        apply();
      })
    };

    $provide.value('$rootScope', $rootScope);
  }));

  var $applyFunc, func, apply;

  beforeEach(inject(function (_$applyFunc_) {
    $applyFunc = _$applyFunc_;

    func = jasmine.createSpy('func');
    apply = $applyFunc(func);
  }));

  it('should be a function', function () {
    expect($applyFunc).toEqual(jasmine.any(Function));
  });

  it('should return a function', function () {
    expect($applyFunc(func)).toEqual(jasmine.any(Function));
  });

  describe('not in $$phase', function () {
    beforeEach(function () {
      apply('foo', 'bar');
    });

    it('should $apply', function () {
      expect($rootScope.$apply).toHaveBeenCalledOnceWith(jasmine.any(Function));
    });

    it('should call func', function () {
      expect(func).toHaveBeenCalledOnceWith('foo', 'bar');
    });
  });

  it('should call func if $rootScope is in $$phase', function () {
    $rootScope.$$phase = '$apply';

    apply('bar', 'baz');

    expect(func).toHaveBeenCalledOnceWith('bar', 'baz');
  });
});
