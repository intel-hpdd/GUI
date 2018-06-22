import highland from 'highland';
import * as fp from '@iml/fp';
import angular from '../../../angular-mock-setup.js';
import { StatusController } from '../../../../source/iml/status/status-records-component.js';

describe('status records component', () => {
  let $scope, $location, ctrl, notificationStream, dateTypeStream;

  beforeEach(
    angular.mock.inject(($rootScope, propagateChange) => {
      $scope = $rootScope.$new();

      $location = {
        search: jest.fn()
      };

      notificationStream = highland();
      jest.spyOn(notificationStream, 'destroy');

      dateTypeStream = highland();
      jest.spyOn(dateTypeStream, 'destroy');

      ctrl = {
        notification$: notificationStream,
        dateType$: dateTypeStream
      };

      StatusController.call(ctrl, $scope, $location, propagateChange);
    })
  );

  it('should return the expected controller properties', () => {
    const instance = expect.objectContaining({
      isCommand: expect.any(Function),
      pageChanged: expect.any(Function)
    });

    expect(ctrl).toEqual(instance);
  });

  it('should destroy the notificationStream when the scope is destroyed', () => {
    $scope.$destroy();
    expect(notificationStream.destroy).toHaveBeenCalledTimes(1);
  });

  it('should destroy the dateTypeStream when the scope is destroyed', () => {
    $scope.$destroy();
    expect(dateTypeStream.destroy).toHaveBeenCalledTimes(1);
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

  describe('getting dateTypeStream data', () => {
    it('should set the dateType on the controller', () => {
      dateTypeStream.write({ isUtc: false });
      expect(ctrl.isUtc).toEqual(false);
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
