import { mock, resetAll } from '../../../system-mock.js';

describe('add server modal', () => {
  let spring, $uibModal, AddServerModalCtrl, openAddServerModal;

  beforeEachAsync(async function() {
    spring = {
      destroy: jasmine.createSpy('destroy')
    };

    const getSpring = jasmine.createSpy('getSpring').and.returnValue(spring);

    $uibModal = {
      open: jasmine.createSpy('$uibModal')
    };

    const mod = await mock('source/iml/server/add-server-modal-ctrl.js', {
      'source/iml/server/assets/html/add-server-modal.html': {
        default: 'addServerModalTemplate'
      },
      'source/iml/socket/get-spring.js': {
        default: getSpring
      }
    });

    AddServerModalCtrl = mod.AddServerModalCtrl;
    openAddServerModal = mod.openAddServerModalFactory($uibModal);
  });

  afterEach(resetAll);

  describe('controller', () => {
    let addServerModalCtrl,
      $scope,
      stepsManager,
      resultEndPromise,
      invokeController;
    const deps = {};

    beforeEach(
      inject(($rootScope, $controller, $q) => {
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

        Object.assign(deps, {
          $scope: $scope,
          $uibModalInstance: {
            close: jasmine.createSpy('$uibModalInstance')
          },
          getAddServerManager: jasmine
            .createSpy('getAddServerManager')
            .and.returnValue(stepsManager),
          servers: {
            addresses: ['host001.localdomain'],
            auth_type: 'existing key'
          },
          step: undefined
        });

        invokeController = function invokeController(moreDeps) {
          addServerModalCtrl = $controller(
            AddServerModalCtrl,
            Object.assign(deps, moreDeps)
          );
        };
      })
    );

    describe('when no step is provided', () => {
      beforeEach(() => invokeController());

      it('should invoke the steps manager', () => {
        expect(deps.getAddServerManager).toHaveBeenCalledOnce();
      });

      it('should start the steps manager', () => {
        expect(stepsManager.start).toHaveBeenCalledOnceWith('addServersStep', {
          showCommand: false,
          data: {
            pdsh: deps.servers.addresses[0],
            servers: deps.servers,
            spring
          }
        });
      });

      it('should close the modal instance when the manager result ends', () => {
        resultEndPromise.resolve('test');

        $scope.$digest();
        expect(deps.$uibModalInstance.close).toHaveBeenCalledOnce();
      });

      it('should contain the manager', () => {
        expect(addServerModalCtrl.manager).toEqual(stepsManager);
      });

      it('should set a destroy event listener', () => {
        expect($scope.$on).toHaveBeenCalledOnceWith(
          '$destroy',
          jasmine.any(Function)
        );
      });

      describe('on close and destroy', () => {
        beforeEach(() => {
          // Invoke the $destroy and closeModal functions
          $scope.$on.calls.allArgs().forEach(call => {
            call[1]();
          });
        });

        it('should destroy the manager', () => {
          expect(stepsManager.destroy).toHaveBeenCalledOnce();
        });

        it('should destroy the spring', () => {
          expect(spring.destroy).toHaveBeenCalledOnce();
        });

        it('should close the modal', () => {
          expect(deps.$uibModalInstance.close).toHaveBeenCalledOnce();
        });
      });
    });
  });

  describe('opening', () => {
    let server, step;

    beforeEach(() => {
      server = {
        address: 'hostname1'
      };
      step = 'addServersStep';

      openAddServerModal(server, step);
    });

    it('should open the modal', () => {
      expect($uibModal.open).toHaveBeenCalledWith({
        template: 'addServerModalTemplate',
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

    describe('checking resolve', () => {
      let resolve;

      beforeEach(() => {
        resolve = $uibModal.open.calls.mostRecent().args[0].resolve;
      });

      it('should return servers', () => {
        expect(resolve.servers()).toEqual({
          auth_type: undefined,
          addresses: ['hostname1']
        });
      });

      it('should return a step', () => {
        expect(resolve.step()).toEqual(step);
      });
    });
  });
});
