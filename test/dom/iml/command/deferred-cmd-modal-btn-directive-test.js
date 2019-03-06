import highland from "highland";
import * as fp from "@iml/fp";
import angular from "../../../angular-mock-setup.js";

describe("deferred command modal button directive exports", () => {
  let s$, mockSocketStream, mockGetStore, deferredCmdModalBtnDirective;

  beforeEach(() => {
    s$ = highland();
    mockSocketStream = jest.fn(() => s$);

    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);

    mockGetStore = {
      dispatch: jest.fn()
    };

    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);

    deferredCmdModalBtnDirective = require("../../../../source/iml/command/deferred-cmd-modal-btn-directive.js")
      .default;
  });

  beforeEach(
    angular.mock.module(($provide, $controllerProvider, $compileProvider) => {
      $compileProvider.component("deferredCmdModalBtn", deferredCmdModalBtnDirective);
    })
  );

  let $scope, cleanText, el, qs, waitingButton, commandDetailButton;
  beforeEach(
    angular.mock.inject(($rootScope, $compile) => {
      const template = '<deferred-cmd-modal-btn resource-uri="::resourceUri"></deferred-cmd-modal-btn>';

      $scope = $rootScope.$new();
      $scope.resourceUri = "/api/command/1/";

      cleanText = fp.flow(
        fp.view(fp.lensProp("textContent")),
        x => x.trim()
      );
      el = $compile(template)($scope)[0];
      qs = el.querySelector.bind(el);
      waitingButton = qs.bind(el, "button[disabled]");
      commandDetailButton = qs.bind(el, ".cmd-detail-btn");

      $scope.$digest();
    })
  );

  it("should not show the waiting button", () => {
    expect(waitingButton()).toBeNull();
  });

  it("should show the detail button", () => {
    expect(commandDetailButton()).toBeShown();
  });

  it("should have the correct detail text", () => {
    expect(cleanText(commandDetailButton())).toBe("Details");
  });

  describe("when clicked", () => {
    beforeEach(() => {
      commandDetailButton().click();
    });

    it("should fetch the resource URI", () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith("/api/command/1/");
    });

    it("should show the waiting button", () => {
      expect(waitingButton()).toBeShown();
    });

    it("should have the correct waiting text", () => {
      expect(cleanText(waitingButton())).toBe("Waiting");
    });

    describe("and data is received", () => {
      beforeEach(() => {
        s$.write("all done!");
        $scope.$digest();
      });

      it("should show the detail button", () => {
        expect(commandDetailButton()).toBeShown();
      });

      it("should hide the waiting button", () => {
        expect(waitingButton()).toBeNull();
      });

      it("should launch the command modal", () => {
        expect(mockGetStore.dispatch).toHaveBeenCalledTimes(1);
        expect(mockGetStore.dispatch).toHaveBeenCalledWith({
          type: "SHOW_COMMAND_MODAL_ACTION",
          payload: ["all done!"]
        });
      });
    });
  });
});
