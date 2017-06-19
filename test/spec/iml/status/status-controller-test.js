import highland from 'highland';
import * as fp from '@mfl/fp';
import angular from '../../../angular-mock-setup.js';
import { StatusController } from '../../../../source/iml/status/status-records-component.js';

describe('status records component', () => {
  let $scope, $location, ctrl, notificationStream;

  beforeEach(
    angular.mock.inject(($rootScope, propagateChange) => {
      $scope = $rootScope.$new();

      $location = {
        search: jest.fn()
      };

      notificationStream = highland();
      jest.spyOn(notificationStream, 'destroy');

      ctrl = {
        notification$: notificationStream
      };

      StatusController.call(ctrl, $scope, $location, propagateChange);
    })
  );

  it('should return the expected controller properties', () => {
    const instance = jasmine.objectContaining({
      isCommand: expect.any(Function),
      pageChanged: expect.any(Function)
    });

    expect(ctrl).toEqual(instance);
  });

  it('should destroy the notificationStream when the scope is destroyed', () => {
    $scope.$destroy();
    expect(notificationStream.destroy).toHaveBeenCalledTimes(1);
  });

  describe('getting notificationStream data', () => {
    beforeEach(() => {
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

    it('should set data on the controller', () => {
      expect(ctrl.data).toEqual([
        {
          foo: 'bar'
        }
      ]);
    });

    it('should set meta on the controller', () => {
      expect(ctrl.meta).toEqual({
        limit: 20,
        offset: 0,
        total_count: 4,
        current_page: 1
      });
    });
  });

  const types = {
    CommandErroredAlert: 'toBeTruthy',
    CommandSuccessfulAlert: 'toBeTruthy',
    CommandRunningAlert: 'toBeTruthy',
    CommandCancelledAlert: 'toBeTruthy',
    FooBarred: 'toBeFalsy'
  };

  Object.keys(types).forEach(type => {
    it('should tell if ' + type + ' is a command', () => {
      fp.invokeMethod(
        types[type],
        [],
        expect(
          ctrl.isCommand({
            record_type: type
          })
        )
      );
    });
  });

  it('should set the location query string to the new offset', () => {
    ctrl.meta = {
      current_page: 5,
      limit: 20
    };

    ctrl.pageChanged();

    expect($location.search).toHaveBeenCalledOnceWith('offset', 80);
  });
});
