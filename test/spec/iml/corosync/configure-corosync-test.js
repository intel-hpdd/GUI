import highland from "highland";
import broadcaster from "../../../../source/iml/broadcaster.js";
import angular from "../../../angular-mock-setup.js";

describe("configure corosync", () => {
  let s,
    bindings,
    ctrl,
    $scope,
    mockSocketStream,
    mod,
    alertStream,
    locks,
    socketResponse,
    waitForCommandCompletion,
    mapWaitForCommandCompletion,
    insertHelpFilter;

  beforeEach(() => {
    mockSocketStream = jest.fn(() => socketResponse);

    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);

    mod = require("../../../../source/iml/corosync/configure-corosync.js");
  });

  describe("controller", () => {
    beforeEach(
      angular.mock.inject(($controller, $rootScope) => {
        $scope = $rootScope.$new();

        mapWaitForCommandCompletion = jest.fn(x => [x]);
        waitForCommandCompletion = jest.fn(() => mapWaitForCommandCompletion);

        socketResponse = highland();

        s = highland();
        jest.spyOn(s, "destroy");

        alertStream = highland();
        locks = {};

        bindings = {
          stream: broadcaster(s),
          alertStream: broadcaster(alertStream),
          locks
        };
        jest.spyOn(alertStream, "destroy");

        insertHelpFilter = jest.fn();

        ctrl = $controller(
          mod.ConfigureCorosyncController,
          {
            $scope,
            insertHelpFilter,
            waitForCommandCompletion
          },
          bindings
        );
      })
    );

    describe("on destroy", () => {
      beforeEach(() => {
        $scope.$destroy();
      });

      it("should destroy the stream", () => {
        expect(s.destroy).toHaveBeenCalledTimes(1);
      });

      it("should destroy the alert stream", () => {
        expect(alertStream.destroy).toHaveBeenCalledTimes(1);
      });
    });

    it("should setup the controller as expected", () => {
      expect(ctrl).toEqual({
        stream: expect.any(Function),
        alertStream: expect.any(Function),
        locks: [],
        observer: expect.any(Object),
        getDiffMessage: expect.any(Function),
        save: expect.any(Function)
      });
    });

    it("should invoke insertHelpFilter on a diff", () => {
      ctrl.getDiffMessage({
        status: "local"
      });

      expect(insertHelpFilter).toHaveBeenCalledOnceWith("local_diff", {
        status: "local"
      });
    });

    describe("save", () => {
      beforeEach(() => {
        ctrl.config = {
          state: "unconfigured",
          id: "1",
          mcast_port: 1025,
          network_interfaces: [1, 2]
        };

        ctrl.save(true);
      });

      it("should set saving to true", () => {
        expect(ctrl.saving).toBe(true);
      });

      it("should put to /corosync_configuration", () => {
        expect(mockSocketStream).toHaveBeenCalledOnceWith(
          "/corosync_configuration/1",
          {
            method: "put",
            json: {
              id: "1",
              mcast_port: 1025,
              network_interfaces: [1, 2]
            }
          },
          true
        );
      });

      it("should wait for command completion", () => {
        socketResponse.write({});

        expect(waitForCommandCompletion).toHaveBeenCalledOnceWith(true);
        expect(mapWaitForCommandCompletion).toHaveBeenCalledOnceWith([{}]);
      });

      it("should stop on an error", () => {
        expect(() => {
          socketResponse
            .write({
              __HighlandStreamError__: true,
              error: new Error("boom!")
            })
            .toThrow("boom!");
        });
      });

      it("should set saving to false", () => {
        socketResponse.write({});

        expect(ctrl.saving).toBe(false);
      });
    });

    describe("configure corosync stream", () => {
      beforeEach(() => {
        ctrl.config = {
          foo: "baz"
        };
      });

      it("should stop on error", () => {
        expect(() => {
          s.write({
            __HighlandStreamError__: true,
            error: new Error("boom!")
          });
        }).toThrow("boom!");
      });

      it("should set the value to the ctrl", () => {
        s.write({
          foo: "bar"
        });

        expect(ctrl.config).toEqual({
          foo: "bar"
        });
      });
    });
  });
});
