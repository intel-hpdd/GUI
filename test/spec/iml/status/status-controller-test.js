import highland from 'highland';
import * as fp from '@mfl/fp';

import { mock, resetAll } from '../../../system-mock.js';

describe('status records component', () => {
  let mod;

  beforeEachAsync(async function() {
    mod = await mock('source/iml/status/status-records-component.js', {});
  });

  afterEach(resetAll);

  beforeEach(module('extendScope'));

  let $scope, $location, ctrl, notificationStream;

  beforeEach(
    inject(($rootScope, propagateChange) => {
      $scope = $rootScope.$new();

      $location = {
        search: jasmine.createSpy('search')
      };

      notificationStream = highland();
      spyOn(notificationStream, 'destroy');

      ctrl = {
        notification$: notificationStream
      };

      mod.StatusController.call(ctrl, $scope, $location, propagateChange);
    })
  );

  it('should return the expected controller properties', () => {
    const instance = jasmine.objectContaining({
      isCommand: jasmine.any(Function),
      pageChanged: jasmine.any(Function)
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
