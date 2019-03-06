import angular from "../../../angular-mock-setup.js";
import highland from "highland";

describe("add server modal", () => {
  let spring, $uibModal, AddServerModalCtrl, openAddServerModal, modalStack$;
  let mockGetStore;

  beforeEach(() => {
    spring = {
      destroy: jest.fn()
    };

    const mockGetSpring = jest.fn(() => spring);

    $uibModal = {
      open: jest.fn()
    };

    jest.mock("../../../../source/iml/socket/get-spring.js", () => mockGetSpring);

    modalStack$ = highland();
    jest.spyOn(modalStack$, "end");
    mockGetStore = {
      select: jest.fn(() => modalStack$)
    };

    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);

    const mod = require("../../../../source/iml/server/add-server-modal-ctrl.js");

    AddServerModalCtrl = mod.AddServerModalCtrl;
    openAddServerModal = mod.openAddServerModalFactory($uibModal);
  });

  describe("controller", () => {
    let addServerModalCtrl, $scope, stepsManager, resultEndPromise, invokeController;
    const deps = {};

    beforeEach(
      angular.mock.inject(($rootScope, $controller, $q) => {
        resultEndPromise = $q.defer();

        stepsManager = {
          start: jest.fn(),
          result: {
            end: resultEndPromise.promise
          },
          SERVER_STEPS: {
            ADD: "addServersStep"
          },
          destroy: jest.fn()
        };

        $scope = $rootScope.$new();
        $scope.$on = jest.fn();
        $scope.$emit = jest.fn();

        Object.assign(deps, {
          $scope: $scope,
          $uibModalInstance: {
            close: jest.fn()
          },
          getAddServerManager: jest.fn(() => stepsManager),
          servers: {
            addresses: ["host001.localdomain"],
            auth_type: "existing key"
          },
          step: undefined
        });

        invokeController = moreDeps => {
          addServerModalCtrl = $controller(AddServerModalCtrl, Object.assign(deps, moreDeps));
        };
      })
    );

    describe("when no step is provided", () => {
      beforeEach(() => invokeController());

      it("should invoke the steps manager", () => {
        expect(deps.getAddServerManager).toHaveBeenCalledTimes(1);
      });

      it("should start the steps manager", () => {
        expect(stepsManager.start).toHaveBeenCalledOnceWith("addServersStep", {
          showCommand: false,
          data: {
            pdsh: deps.servers.addresses[0],
            servers: deps.servers,
            spring
          }
        });
      });

      it("should close the modal instance when the manager result ends", () => {
        resultEndPromise.resolve("test");

        $scope.$digest();
        expect(deps.$uibModalInstance.close).toHaveBeenCalledTimes(1);
      });

      it("should contain the manager", () => {
        expect(addServerModalCtrl.manager).toEqual(stepsManager);
      });

      it("should set a destroy event listener", () => {
        expect($scope.$on).toHaveBeenCalledOnceWith("$destroy", expect.any(Function));
      });

      describe("on close and destroy", () => {
        beforeEach(() => {
          $scope.$emit.mockImplementation(() => {
            $scope.$on.mock.calls[0][1]();
            $scope.$on.mock.calls[1][1]();
          });
          modalStack$.write([]);
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        });

        it("should destroy the manager", () => {
          expect(stepsManager.destroy).toHaveBeenCalledTimes(1);
        });

        it("should destroy the spring", () => {
          expect(spring.destroy).toHaveBeenCalledTimes(1);
        });

        it("should close the modal", () => {
          expect(deps.$uibModalInstance.close).toHaveBeenCalledTimes(1);
        });

        it("should end the modalStack$", () => {
          expect(modalStack$.end).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe("opening", () => {
    let server, step;

    beforeEach(() => {
      server = {
        address: "hostname1"
      };
      step = "addServersStep";

      openAddServerModal(server, step);
    });

    it("should open the modal", () => {
      expect($uibModal.open).toHaveBeenCalledWith({
        template: `<step-container manager="addServer.manager"></step-container>`,
        controller: "AddServerModalCtrl as addServer",
        backdropClass: "add-server-modal-backdrop",
        backdrop: "static",
        keyboard: false,
        windowClass: "add-server-modal",
        resolve: {
          servers: expect.any(Function),
          step: expect.any(Function)
        }
      });
    });

    describe("checking resolve", () => {
      let resolve;

      beforeEach(() => {
        resolve = $uibModal.open.mock.calls[0][0].resolve;
      });

      it("should return servers", () => {
        expect(resolve.servers()).toEqual({
          auth_type: undefined,
          addresses: ["hostname1"]
        });
      });

      it("should return a step", () => {
        expect(resolve.step()).toEqual(step);
      });
    });
  });
});
