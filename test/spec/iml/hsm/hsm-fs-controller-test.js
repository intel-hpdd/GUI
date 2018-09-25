import highland from "highland";
import HsmFsCtrl from "../../../../source/iml/hsm/hsm-fs-controller";
import broadcaster from "../../../../source/iml/broadcaster.js";
import angular from "../../../angular-mock-setup.js";
import * as maybe from "@iml/maybe";

describe("HSM fs controller", () => {
  let ctrl, $scope, $state, $stateParams, fsStream, qsStream, qs$, fsStreamB;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  beforeEach(
    angular.mock.inject(($rootScope, propagateChange) => {
      $scope = $rootScope.$new();

      $state = {
        go: jest.fn(),
        router: {
          globals: {
            params: {
              fsId: "1"
            }
          }
        }
      };

      $stateParams = {
        param: "val"
      };

      fsStream = highland();
      jest.spyOn(fsStream, "destroy");

      qs$ = highland();
      jest.spyOn(qs$, "destroy");
      qsStream = jest.fn(() => qs$);
      qs$.write({
        qs: ""
      });
      jest.runAllTimers();

      fsStreamB = broadcaster(fsStream);

      ctrl = {};
      HsmFsCtrl.bind(ctrl)($scope, $state, $stateParams, qsStream, fsStreamB, propagateChange);
    })
  );

  it("should setup ctrl as expected", () => {
    const instance = Object.assign({}, HsmFsCtrl, {
      onUpdate: expect.any(Function)
    });

    expect(ctrl).toEqual(instance);
  });

  describe("onUpdate", () => {
    it("should go to the new path without id", () => {
      ctrl.selectedFs = null;

      ctrl.onUpdate();

      expect($state.go).toHaveBeenCalledOnceWith("app.hsmFs.hsm", {
        fsId: "",
        resetState: false
      });
    });

    it("should go to the new path with id", () => {
      ctrl.selectedFs = {
        id: "1"
      };

      ctrl.onUpdate();

      expect($state.go).toHaveBeenCalledOnceWith("app.hsmFs.hsm", {
        fsId: "1",
        resetState: false
      });
    });
  });

  it("should set fileSystems data", () => {
    fsStream.write([{ id: "1" }, { id: "2" }]);
    jest.runAllTimers();

    expect(ctrl.fileSystems).toEqual([{ id: "1" }, { id: "2" }]);
  });

  it("should set fs to the fsId", () => {
    fsStream.write([
      {
        id: "1",
        label: "foo"
      },
      {
        id: "2",
        label: "bar"
      }
    ]);
    jest.runAllTimers();

    expect(ctrl.fs).toEqual(
      maybe.ofJust({
        id: "1",
        label: "foo"
      })
    );
  });

  it("should filter out if fsId does not exist", () => {
    $state.router.globals.params.fsId = "";

    fsStream.write([{ id: "1" }]);

    qs$.write({
      qs: ""
    });
    jest.runAllTimers();

    expect(ctrl.fs).toBe(null);
  });

  it("should alter fs id on change", () => {
    $state.router.globals.params.fsId = "3";

    fsStream.write([{ id: "1" }, { id: "3" }]);

    qs$.write({
      qs: ""
    });
    jest.runAllTimers();

    expect(ctrl.fs).toEqual(maybe.ofJust({ id: "3" }));
  });

  it("should call qsStream", () => {
    expect(qsStream).toHaveBeenCalledOnceWith($stateParams, {
      to: expect.any(Function)
    });
  });

  describe("destroy", () => {
    beforeEach(() => {
      $scope.$destroy();
    });

    it("should destroy the fsStream", () => {
      expect(fsStream.destroy).toHaveBeenCalled();
    });

    it("should destroy the qsStream", () => {
      expect(qs$.destroy).toHaveBeenCalled();
    });
  });
});
