import * as fp from '@iml/fp';
import angular from '../../angular-mock-setup.js';
import extendScopeModule from '../../../source/iml/extend-scope-module';

describe('extend scope test', () => {
  let $exceptionHandler;

  beforeEach(
    angular.mock.module(extendScopeModule, $provide => {
      $exceptionHandler = jest.fn();
      $provide.value('$exceptionHandler', $exceptionHandler);
    })
  );

  let localApply, $scope;

  beforeEach(
    angular.mock.inject((_localApply_, $rootScope) => {
      localApply = _localApply_;
      $scope = $rootScope.$new();
    })
  );

  describe('local apply', function() {
    it('should be a function', function() {
      expect(localApply).toEqual(expect.any(Function));
    });

    it('should be on scope', function() {
      expect($scope.localApply).toBe(localApply);
    });

    it('should digest a local scope', function() {
      jest.spyOn($scope, '$digest');

      localApply($scope);

      expect($scope.$digest).toHaveBeenCalledTimes(1);
    });

    it('should not digest if root scope is in phase', function() {
      jest.spyOn($scope, '$digest');

      $scope.$root.$$phase = '$apply';

      localApply($scope);

      expect($scope.$digest).not.toHaveBeenCalledTimes(1);
    });

    it('should call the exception handler if $digest throws an error', function() {
      jest.spyOn($scope, '$digest').mockImplementation(() => {
        throw new Error('boom!');
      });

      try {
        localApply($scope);
      } catch (e) {
        fp.noop;
      } finally {
        expect($exceptionHandler).toHaveBeenCalledOnceWith(new Error('boom!'));
      }
    });

    it('should throw if digest throws an error', function() {
      jest.spyOn($scope, '$digest').mockImplementation(() => {
        throw new Error('boom!');
      });

      expect(function() {
        localApply($scope);
      }).toThrow(new Error('boom!'));
    });

    it('should call the exception handler if fn throws an error', function() {
      localApply($scope, function() {
        throw new Error('boom!');
      });

      expect($exceptionHandler).toHaveBeenCalledOnceWith(new Error('boom!'));
    });

    it('should return the value of fn', function() {
      expect(localApply($scope, fp.always(3))).toBe(3);
    });

    describe('with destroyed scope', () => {
      let spy;
      beforeEach(() => {
        spy = jest.fn();
        $scope.$destroy();
        jest.spyOn($scope, '$digest');
        localApply($scope, spy);
      });

      it('should invoke the function', () => {
        expect(spy).toHaveBeenCalled();
      });

      it('should not call $digest', () => {
        expect($scope.$digest).not.toHaveBeenCalled();
      });

      it('should not invoke the exception handler', () => {
        expect($exceptionHandler).not.toHaveBeenCalled();
      });
    });
  });

  describe('exception handler', function() {
    it('should exist on scope', function() {
      expect($scope.handleException).toEqual(expect.any(Function));
    });

    it('should call $exceptionHandler', function() {
      $scope.handleException(new Error('boom!'));

      expect($exceptionHandler).toHaveBeenCalledOnceWith(new Error('boom!'));
    });

    it('should be curried to one arg', function() {
      $scope.handleException(new Error('boom!'), 'foo');

      expect($exceptionHandler).toHaveBeenCalledOnceWith(new Error('boom!'));
    });
  });
});
