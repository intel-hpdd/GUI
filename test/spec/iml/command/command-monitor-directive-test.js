import highland from "highland";
import angular from "../../../angular-mock-setup.js";
import { render } from "inferno";

describe("Command monitor controller", () => {
  let $scope, ctrl, mockGetCommandStream, commandStream, mod, mockSocketStream, mockGetStore, stream, div, body;

  beforeEach(() => {
    stream = highland();
    mockSocketStream = jest.fn(() => stream);
    jest.spyOn(stream, "destroy");

    commandStream = highland();
    jest.spyOn(commandStream, "destroy");
    mockGetCommandStream = jest.fn(() => commandStream);

    mockGetStore = {
      dispatch: jest.fn()
    };

    jest.mock("../../../../source/iml/socket/socket-stream", () => mockSocketStream);
    jest.mock("../../../../source/iml/command/get-command-stream", () => mockGetCommandStream);
    jest.mock("../../../../source/iml/store/get-store", () => mockGetStore);

    mod = require("../../../../source/iml/command/command-monitor-directive.js");

    body = document.querySelector("body");
    div = document.createElement("div");
    if (body) body.appendChild(div);
  });

  afterEach(() => {
    render(null, div);
    if (body) body.removeChild(div);
  });

  beforeEach(
    angular.mock.inject(($rootScope, $controller) => {
      $scope = $rootScope.$new();
      jest.spyOn($scope, "$on");

      ctrl = $controller(mod.CommandMonitorCtrl, {
        $scope,
        $element: [div]
      });
    })
  );

  it("should return a directive by default", () => {
    expect(mod.default()).toEqual({
      restrict: "A",
      controller: expect.any(Function),
      controllerAs: "$ctrl"
    });
  });

  it("should request data", () => {
    expect(mockSocketStream).toHaveBeenCalledOnceWith("/command", {
      qs: {
        limit: 0,
        errored: false,
        complete: false
      }
    });
  });

  describe("destroy", () => {
    it("should listen", () => {
      expect($scope.$on).toHaveBeenCalledOnceWith("$destroy", expect.any(Function));
    });

    it("should end the monitor on destroy", () => {
      const handler = $scope.$on.mock.calls[0][1];

      handler();

      expect(stream.destroy).toHaveBeenCalledTimes(1);
    });
  });

  describe("handling responses", () => {
    let lastObjects;

    describe("with data", () => {
      beforeEach(() => {
        lastObjects = {
          objects: [{ cancelled: true }, { cancelled: false }]
        };

        stream.write(lastObjects);
      });

      it("should update length", () => {
        expect(ctrl.length).toEqual(1);
      });

      it("should save the last response", () => {
        expect(ctrl.lastObjects).toEqual([{ cancelled: false }]);
      });

      describe("show pending", () => {
        let a;
        beforeEach(() => {
          a = div.querySelector("a");
          a.click();
        });

        it("should open the command modal with the stream", () => {
          expect(mockGetStore.dispatch).toHaveBeenCalledWith({
            type: "SHOW_COMMAND_MODAL_ACTION",
            payload: [{ cancelled: false }]
          });
        });
      });
    });

    describe("without data", () => {
      beforeEach(() => {
        stream.write({ objects: [] });
      });

      it("should update length", () => {
        expect(ctrl.length).toEqual(0);
      });
    });
  });
});
