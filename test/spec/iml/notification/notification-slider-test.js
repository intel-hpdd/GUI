import highland from 'highland';
import angular from '../../../angular-mock-setup.js';

import { NotificationSliderController } from '../../../../source/iml/notification/notification-slider.js';

describe('The notification slider', () => {
  let $exceptionHandler, $scope, $timeout, alertStream, ctrl;

  beforeEach(
    angular.mock.inject(($rootScope, _$timeout_, localApply) => {
      $scope = $rootScope.$new();
      $exceptionHandler = jest.fn();
      $timeout = _$timeout_;

      alertStream = highland();

      ctrl = { stream: alertStream };

      NotificationSliderController.bind(ctrl)($scope, $timeout, localApply, $exceptionHandler);
    })
  );

  it('should be closed to start', () => {
    expect($scope.open).toBeFalsy();
  });

  describe('single alert', () => {
    beforeEach(() => {
      alertStream.write({
        objects: [
          {
            message: 'an alert'
          }
        ]
      });
    });

    it('should open with data', () => {
      expect($scope.open).toBe(true);
    });

    it('should print the alert to message', () => {
      expect($scope.message).toEqual('an alert');
    });

    it('should close after 5 seconds', () => {
      $timeout.flush(5000);
      expect($scope.open).toBe(false);
      $timeout.verifyNoPendingTasks();
    });

    it('should queue the close', () => {
      function toThrow() {
        $timeout.verifyNoPendingTasks();
      }

      expect(toThrow).toThrow();
    });

    it('should cancel a timeout on enter', () => {
      $scope.enter();
      $timeout.verifyNoPendingTasks();
    });

    it('should create a new timeout on leave', () => {
      $scope.enter();
      $scope.leave();
      $timeout.flush(5000);
      expect($scope.open).toBe(false);
    });

    it('should cancel on close', () => {
      $scope.close();
      $timeout.verifyNoPendingTasks();
    });

    it('should set open to false on close', () => {
      $scope.close();
      expect($scope.open).toBe(false);
    });
  });

  describe('multiple alerts', () => {
    beforeEach(() => {
      alertStream.write({
        objects: [{ message: 'foo1' }, { message: 'foo2' }]
      });
    });

    it('should write a multiple alert message', () => {
      expect($scope.message).toEqual('2 active alerts');
    });
  });

  describe('writing an error', () => {
    beforeEach(() => {
      alertStream.write({
        __HighlandStreamError__: true,
        error: new Error('boom!')
      });
    });

    it('should throw', () => {
      expect($exceptionHandler).toHaveBeenCalledOnceWith(new Error('boom!'));
    });
  });

  describe('writing empty', () => {
    beforeEach(() => {
      alertStream.write({
        objects: []
      });
    });

    it('should not write a message', () => {
      expect($scope.message).toBe(undefined);
    });

    it('should not open the slider', () => {
      expect($scope.open).toBe(undefined);
    });

    it('should not register a promise', () => {
      $timeout.verifyNoPendingTasks();
    });
  });
});
