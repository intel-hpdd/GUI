import highland from 'highland';

import {
  curry,
  noop
} from 'intel-fp';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('configure corosync', () => {
  var s, bindings, ctrl, $scope, socketStream, mod,
    socketResponse, waitForCommandCompletion, insertHelpFilter;

  beforeEachAsync(async function () {
    socketStream = jasmine.createSpy('socketStream');

    mod = await mock('source/iml/corosync/configure-corosync.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });
  });

  afterEach(resetAll);

  beforeEach(module('corosyncModule', 'highland', $exceptionHandlerProvider => {
    $exceptionHandlerProvider.mode('log');
  }));

  describe('controller', () => {
    beforeEach(inject(($controller, $rootScope, addProperty) => {
      $scope = $rootScope.$new();

      waitForCommandCompletion = jasmine.createSpy('waitForCommandCompletion')
        .and.callFake((bool, x) => {
          return [x];
        });

      socketResponse = highland();
      socketStream
        .and
        .returnValue(
          socketResponse.through(addProperty)
        );

      s = highland();
      spyOn(s, 'destroy');

      bindings = {
        stream: s.through(addProperty),
        alertStream: highland(),
        jobStream: highland()
      };
      spyOn(bindings.alertStream, 'destroy');
      spyOn(bindings.jobStream, 'destroy');

      insertHelpFilter = jasmine.createSpy('insertHelpFilter');

      ctrl = $controller(
        mod.ConfigureCorosyncController,
        {
          $scope,
          insertHelpFilter,
          waitForCommandCompletion: curry(2, waitForCommandCompletion)
        },
        bindings
      );
    }));

    describe('on destroy', () => {
      beforeEach(() => {
        $scope.$destroy();
      });

      it('should destroy the stream', () => {
        expect(s.destroy).toHaveBeenCalledOnce();
      });

      it('should destroy the alert stream', () => {
        expect(bindings.alertStream.destroy).toHaveBeenCalledOnce();
      });

      it('should destroy the job stream', () => {
        expect(bindings.jobStream.destroy).toHaveBeenCalledOnce();
      });
    });

    it('should setup the controller as expected', () => {

      expect(ctrl)
        .toEqual(window.extendWithConstructor(
          mod.ConfigureCorosyncController, {
            stream: jasmine.any(Object),
            alertStream: jasmine.any(Object),
            jobStream: jasmine.any(Object),
            observer: jasmine.any(Object),
            getDiffMessage: jasmine.any(Function),
            save: jasmine.any(Function)
          }));
    });

    it('should invoke insertHelpFilter on a diff', () => {
      ctrl.getDiffMessage({
        status: 'local'
      });

      expect(insertHelpFilter).toHaveBeenCalledOnceWith('local_diff', {
        status: 'local'
      });
    });

    describe('save', () => {
      beforeEach(() => {
        ctrl.config = {
          state: 'unconfigured',
          id: '1',
          mcast_port: 1025,
          network_interfaces: [1, 2]
        };

        ctrl.save(true);
      });

      it('should set saving to true', () => {
        expect(ctrl.saving).toBe(true);
      });

      it('should put to /corosync_configuration', () => {
        expect(socketStream).toHaveBeenCalledOnceWith('/corosync_configuration/1', {
          method: 'put',
          json: {
            id: '1',
            mcast_port: 1025,
            network_interfaces: [1, 2]
          }
        }, true);
      });

      it('should wait for command completion', () => {
        socketResponse.write({});

        expect(waitForCommandCompletion).toHaveBeenCalledOnceWith(true, {command: {} });
      });

      it('should stop on an error', inject($exceptionHandler => {
        socketResponse.write({
          __HighlandStreamError__: true,
          error: new Error('boom!')
        });

        expect($exceptionHandler.errors).toEqual([new Error('boom!')]);
      }));

      it('should set saving to false', () => {
        socketResponse.write({});

        expect(ctrl.saving).toBe(false);
      });
    });

    describe('configure corosync stream', () => {
      beforeEach(() => {
        ctrl.observer
          .stopOnError(noop)
          .each(noop);

        ctrl.config = {
          foo: 'baz'
        };
      });

      it('should stop on error', inject($exceptionHandler => {
        s.write({
          __HighlandStreamError__: true,
          error: new Error('boom!')
        });

        expect($exceptionHandler.errors).toEqual([new Error('boom!')]);
      }));

      it('should set the value to the ctrl', () => {
        s.write({
          foo: 'bar'
        });

        expect(ctrl.config).toEqual({
          foo: 'bar'
        });
      });
    });
  });
});
