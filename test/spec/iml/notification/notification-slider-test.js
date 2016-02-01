import highland from 'highland';

import notificationModule from '../../../../source/iml/notification/notification-module';

describe('The notification slider', () => {
  var $exceptionHandler;

  beforeEach(module(notificationModule, function ($provide) {
    $exceptionHandler = jasmine.createSpy('$exceptionHandler');
    $provide.value('$exceptionHandler', $exceptionHandler);
  }));

  var $scope, $timeout, alertStream;

  beforeEach(inject(function ($controller, $rootScope, _$timeout_) {
    $scope = $rootScope.$new();
    $timeout = _$timeout_;

    alertStream = highland();

    $controller('NotificationSliderController as ctrl', {
      $scope: $scope,
      $timeout: $timeout
    }, {
      stream: alertStream
    });
  }));

  it('should be closed to start', function () {
    expect($scope.open).toBeFalsy();
  });

  describe('single alert', function () {
    beforeEach(function () {
      alertStream.write({
        objects: [
          {
            message: 'an alert'
          }
        ]
      });
    });

    it('should open with data', function () {
      expect($scope.open).toBe(true);
    });

    it('should print the alert to message', function () {
      expect($scope.message).toEqual('an alert');
    });

    it('should close after 5 seconds', function () {
      $timeout.flush(5000);
      expect($scope.open).toBe(false);
      $timeout.verifyNoPendingTasks();
    });

    it('should queue the close', function () {
      function toThrow () {
        $timeout.verifyNoPendingTasks();
      }

      expect(toThrow).toThrow();
    });

    it('should cancel a timeout on enter', function () {
      $scope.enter();
      $timeout.verifyNoPendingTasks();
    });

    it('should create a new timeout on leave', function () {
      $scope.enter();
      $scope.leave();
      $timeout.flush(5000);
      expect($scope.open).toBe(false);
    });

    it('should cancel on close', function () {
      $scope.close();
      $timeout.verifyNoPendingTasks();
    });

    it('should set open to false on close', function () {
      $scope.close();
      expect($scope.open).toBe(false);
    });
  });

  describe('multiple alerts', function () {
    beforeEach(function () {
      alertStream.write({
        objects: [
          { message: 'foo1' },
          { message: 'foo2' }
        ]
      });
    });

    it('should write a multiple alert message', function () {
      expect($scope.message).toEqual('2 active alerts');
    });
  });

  describe('writing an error', function () {
    beforeEach(function () {
      alertStream.write({
        __HighlandStreamError__: true,
        error: new Error('boom!')
      });
    });

    it('should throw', function () {
      expect($exceptionHandler).toHaveBeenCalledOnceWith(new Error('boom!'));
    });
  });

  describe('writing empty', function () {
    beforeEach(function () {
      alertStream.write({
        objects: []
      });
    });

    it('should not write a message', function () {
      expect($scope.message).toBe(undefined);
    });

    it('should not open the slider', function () {
      expect($scope.open).toBe(undefined);
    });

    it('should not register a promise', function () {
      $timeout.verifyNoPendingTasks();
    });
  });
});
