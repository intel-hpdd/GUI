import angular from 'angular';
const {module, inject} = angular.mock;

describe('add server modal', function () {
  'use strict';

  beforeEach(module('server'));

  describe('controller', function () {
    var addServerModalCtrl, $scope, stepsManager, spring,
      resultEndPromise, invokeController;
    var deps = {};

    beforeEach(inject(function ($rootScope, $controller, $q) {
      resultEndPromise = $q.defer();

      stepsManager = {
        start: jasmine.createSpy('start'),
        result: {
          end: resultEndPromise.promise
        },
        SERVER_STEPS: {
          ADD: 'addServersStep'
        },
        destroy: jasmine.createSpy('destroy')
      };

      $scope = $rootScope.$new();
      $scope.$on = jasmine.createSpy('$on');

      spring = {
        destroy: jasmine.createSpy('destroy')
      };

      _.extend(deps, {
        $scope: $scope,
        getSpring: jasmine.createSpy('getSpring')
          .and.returnValue(spring),
        $modalInstance: {
          close: jasmine.createSpy('$modalInstance')
        },
        getAddServerManager: jasmine.createSpy('getAddServerManager')
          .and.returnValue(stepsManager),
        servers: {
          addresses: ['host001.localdomain'],
          auth_type: 'existing key'
        },
        step: undefined
      });

      invokeController = function invokeController (moreDeps) {
        addServerModalCtrl = $controller('AddServerModalCtrl', _.extend(deps, moreDeps));
      };
    }));

    describe('when no step is provided', function () {
      beforeEach(function () {
        invokeController();
      });

      it('should invoke the steps manager', function () {
        expect(deps.getAddServerManager).toHaveBeenCalledOnce();
      });

      it('should start the steps manager', function () {
        expect(stepsManager.start).toHaveBeenCalledOnceWith('addServersStep', {
          showCommand: false,
          data: {
            pdsh: deps.servers.addresses[0],
            servers: deps.servers,
            spring
          }
        });
      });

      it('should close the modal instance when the manager result ends', function () {
        resultEndPromise.resolve('test');

        $scope.$digest();
        expect(deps.$modalInstance.close).toHaveBeenCalledOnce();
      });

      it('should contain the manager', function () {
        expect(addServerModalCtrl.manager).toEqual(stepsManager);
      });

      it('should set a destroy event listener', function () {
        expect($scope.$on).toHaveBeenCalledOnceWith('$destroy', jasmine.any(Function));
      });

      describe('on close and destroy', function () {
        beforeEach(function () {
          // Invoke the $destroy and closeModal functions
          $scope.$on.calls.allArgs().forEach(function (call) {
            call[1]();
          });
        });

        it('should destroy the manager', function () {
          expect(stepsManager.destroy).toHaveBeenCalledOnce();
        });

        it('should destroy the spring', function () {
          expect(spring.destroy).toHaveBeenCalledOnce();
        });

        it('should close the modal', function () {
          expect(deps.$modalInstance.close).toHaveBeenCalledOnce();
        });
      });
    });
  });

  describe('opening', function () {
    var openAddServerModal, $modal, server, step;
    beforeEach(module(function ($provide) {
      $modal = {
        open: jasmine.createSpy('$modal')
      };

      $provide.value('$modal', $modal);
    }));

    beforeEach(inject(function (_openAddServerModal_) {
      server = { address: 'hostname1' };
      step = 'addServersStep';
      openAddServerModal = _openAddServerModal_;
      openAddServerModal(server, step);
    }));

    it('should open the modal', function () {
      expect($modal.open).toHaveBeenCalledWith({
        templateUrl: 'iml/server/assets/html/add-server-modal.html',
        controller: 'AddServerModalCtrl as addServer',
        backdropClass: 'add-server-modal-backdrop',
        backdrop: 'static',
        keyboard: 'false',
        windowClass: 'add-server-modal',
        resolve: {
          servers: jasmine.any(Function),
          step: jasmine.any(Function)
        }
      });
    });

    describe('checking resolve', function () {
      var resolve;
      beforeEach(function () {
        resolve = $modal.open.calls.mostRecent().args[0].resolve;
      });

      it('should return servers', function () {
        expect(resolve.servers()).toEqual({
          auth_type: undefined,
          addresses: ['hostname1']
        });
      });

      it('should return a step', function () {
        expect(resolve.step()).toEqual(step);
      });
    });
  });

  describe('throw if server errors', function () {
    var throwIfServerErrors, handler;

    beforeEach(inject(function (_throwIfServerErrors_) {
      handler = jasmine.createSpy('handler');
      throwIfServerErrors = _throwIfServerErrors_(handler);
    }));

    it('should be a function', function () {
      expect(throwIfServerErrors).toEqual(jasmine.any(Function));
    });

    it('should throw if there are any errors', function () {
      expect(shouldThrow).toThrow(new Error('["fooz"]'));

      function shouldThrow () {
        throwIfServerErrors({
          errors: ['fooz']
        });
      }
    });

    it('should call the handler if there are not any errors', function () {
      var response = {
        body: {
          stuff: []
        }
      };

      throwIfServerErrors(response);

      expect(handler).toHaveBeenCalledOnceWith(response);
    });
  });
});
