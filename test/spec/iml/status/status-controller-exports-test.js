import angular from 'angular/angular';
const {module, inject} = angular.mock;

import {invokeMethod} from 'intel-fp/fp';
import StatusController from '../../../../source/chroma_ui/iml/status/status-controller-exports';

describe('status controller', function () {
  beforeEach(module('status'));

  var $scope, $location, ctrl, notificationStream;

  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();

    $location = {
      search: jasmine.createSpy('search')
    };

    notificationStream = highland();
    spyOn(notificationStream, 'destroy');

    ctrl = $controller('StatusController', {
      $scope: $scope,
      $location: $location,
      notificationStream: notificationStream
    });
  }));

  it('should return the expected controller properties', function () {
    const instance = window.extendWithConstructor(StatusController, {
      isCommand: jasmine.any(Function),
      pageChanged: jasmine.any(Function)
    });

    expect(ctrl).toEqual(instance);
  });

  it('should destroy the notificationStream when the scope is destroyed', function () {
    $scope.$destroy();
    expect(notificationStream.destroy).toHaveBeenCalledOnce();
  });

  describe('getting notificationStream data', function () {
    beforeEach(function () {
      notificationStream.write({
        meta: {
          limit: 20,
          offset: 0,
          total_count: 4
        },
        objects: [
          {
            foo: 'bar'
          }
        ]
      });
    });

    it('should set data on the controller', function () {
      expect(ctrl.data).toEqual([
        {
          foo: 'bar'
        }
      ]);
    });

    it('should set meta on the controller', function () {
      expect(ctrl.meta).toEqual({
        limit: 20,
        offset: 0,
        total_count: 4,
        current_page: 1
      });
    });
  });

  var types = {
    CommandErroredAlert: 'toBeTruthy',
    CommandSuccessfulAlert: 'toBeTruthy',
    CommandRunningAlert: 'toBeTruthy',
    CommandCancelledAlert: 'toBeTruthy',
    FooBarred: 'toBeFalsy'
  };

  Object.keys(types).forEach(function (type) {
    it('should tell if ' + type + ' is a command', function () {
      invokeMethod(types[type], [], expect(ctrl.isCommand({
        record_type: type
      })));
    });
  });

  it('should set the location query string to the new offset', function () {
    ctrl.meta = {
      current_page: 5,
      limit: 20
    };

    ctrl.pageChanged();

    expect($location.search).toHaveBeenCalledOnceWith('offset', 80);
  });
});
