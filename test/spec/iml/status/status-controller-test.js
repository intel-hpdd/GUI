import highland from "highland";
import * as fp from "@iml/fp";
import angular from "../../../angular-mock-setup.js";
import { StatusController } from "../../../../source/iml/status/status-records-component.js";

describe("status records component", () => {
  let $scope, $location, ctrl, notificationStream, tzPickerB, locks$;

  beforeEach(
    angular.mock.inject(($rootScope, propagateChange) => {
      $scope = $rootScope.$new();

      $location = {
        search: jest.fn()
      };

      notificationStream = highland();
      jest.spyOn(notificationStream, "destroy");

      tzPickerB = {
        endBroadcast: jest.fn()
      };

      locks$ = highland();
      jest.spyOn(locks$, "destroy");

      ctrl = {
        notification$: notificationStream,
        tzPickerB,
        locks$
      };

      StatusController.call(ctrl, $scope, $location, propagateChange);
    })
  );

  it("should return the expected controller properties", () => {
    const instance = expect.objectContaining({
      isCommand: expect.any(Function),
      pageChanged: expect.any(Function)
    });

    expect(ctrl).toEqual(instance);
  });

  describe("destroying the scope", () => {
    beforeEach(() => {
      $scope.$destroy();
    });

    it("should destroy the notificationStream", () => {
      expect(notificationStream.destroy).toHaveBeenCalledOnceWith();
    });

    it("should end the tzPicker broadcast", () => {
      expect(tzPickerB.endBroadcast).toHaveBeenCalledOnceWith();
    });

    it("should destroy the locks stream", () => {
      expect(locks$.destroy).toHaveBeenCalledTimes(1);
    });
  });

  describe("getting notificationStream data", () => {
    beforeEach(() => {
      notificationStream.write({
        meta: {
          limit: 20,
          offset: 0,
          total_count: 4
        },
        objects: [
          {
            foo: "bar"
          }
        ]
      });
    });

    it("should set data on the controller", () => {
      expect(ctrl.data).toEqual([
        {
          foo: "bar"
        }
      ]);
    });

    it("should set meta on the controller", () => {
      expect(ctrl.meta).toEqual({
        limit: 20,
        offset: 0,
        total_count: 4,
        current_page: 1
      });
    });
  });

  describe("locks stream", () => {
    beforeEach(() => {
      locks$.write({ key: "val" });
    });

    it("should write data to the controller", () => {
      expect(ctrl.locks).toEqual({ key: "val" });
    });
  });

  const types = {
    CommandErroredAlert: "toBeTruthy",
    CommandSuccessfulAlert: "toBeTruthy",
    CommandRunningAlert: "toBeTruthy",
    CommandCancelledAlert: "toBeTruthy",
    FooBarred: "toBeFalsy"
  };

  Object.keys(types).forEach(type => {
    it("should tell if " + type + " is a command", () => {
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

  it("should set the location query string to the new offset", () => {
    ctrl.meta = {
      current_page: 5,
      limit: 20
    };

    ctrl.pageChanged();

    expect($location.search).toHaveBeenCalledOnceWith("offset", 80);
  });
});
