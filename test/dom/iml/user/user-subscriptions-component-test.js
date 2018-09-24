import highland from "highland";
import configToggle from "../../../../source/iml/config-toggle/config-toggle.js";
import multiTogglerContainerComponent from "../../../../source/iml/multi-toggler/multi-toggler-container-component.js";
import diffContainer from "../../../../source/iml/big-differ/diff-container.js";
import diffComponent from "../../../../source/iml/big-differ/diff-component.js";
import diffModel from "../../../../source/iml/big-differ/diff-model.js";
import multiTogglerModelDirective from "../../../../source/iml/multi-toggler/multi-toggler-model-directive.js";
import resetDiff from "../../../../source/iml/big-differ/reset-diff.js";
import multiTogglerComponent from "../../../../source/iml/multi-toggler/multi-toggler-component.js";
import angular from "../../../angular-mock-setup.js";
import angularUiBootstrap from "angular-ui-bootstrap";

describe("user subscriptions component", () => {
  let mod, mockSocketStream, socket$;

  beforeEach(() => {
    if (!window.angular) require("angular");

    mockSocketStream = jest.fn().mockImplementation(() => (socket$ = highland()));

    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);

    mod = require("../../../../source/iml/user/user-subscriptions-component.js");
  });

  beforeEach(
    angular.mock.module(angularUiBootstrap, ($provide, $compileProvider) => {
      $provide.value("insertHelpFilter", jest.fn());

      $compileProvider.component("userSubscriptions", mod.default);
      $compileProvider.component("multiTogglerContainer", multiTogglerContainerComponent);
      $compileProvider.component("differ", diffComponent);
      $compileProvider.component("resetDiff", resetDiff);
      $compileProvider.component("multiToggler", multiTogglerComponent);

      $compileProvider.directive("configToggle", configToggle);
      $compileProvider.directive("diffContainer", diffContainer);
      $compileProvider.directive("diffModel", diffModel);
      $compileProvider.directive("multiTogglerModel", multiTogglerModelDirective);
    })
  );

  let el, $scope;
  beforeEach(
    angular.mock.inject(($compile: $compileT, $rootScope: $scopeT) => {
      $scope = $rootScope.$new();

      $scope.subscriptions = [
        {
          description: "Alert event",
          resource_uri: "/api/alert_type/24/",
          selected: true,
          sub_uri: "/api/alert_subscription/45/"
        },
        {
          description: "Syslog event",
          resource_uri: "/api/alert_type/26/",
          selected: false
        }
      ];

      $scope.resourceUri = "/api/user/2";

      const template =
        '<user-subscriptions resource-uri="resourceUri" subscriptions="subscriptions"></user-subscriptions>';

      el = $compile(template)($scope)[0];
      $scope.$digest();
    })
  );

  it("should have a header", () => {
    expect(el.querySelector(".section-header")).toHaveText("Notifications");
  });

  it("should show the configure button", () => {
    expect(el.querySelector(".edit-btn")).not.toBeNull();
  });

  it("should show the list of choices", () => {
    const labels = Array.from(el.querySelectorAll(".sub-label")).map(x => x.textContent);

    expect(labels).toEqual(["Alert event:", "Syslog event:"]);
  });

  it("should not show the saving banner", () => {
    expect(el.querySelector(".alert-info")).toBeNull();
  });

  describe("configuring", () => {
    beforeEach(() => {
      el.querySelector(".edit-btn").click();
    });

    it("should show the toggle controls", () => {
      expect(el.querySelector(".toggle-controls")).not.toBeNull();
    });

    it("should hide the configure button", () => {
      expect(el.querySelector(".edit-btn")).toBeNull();
    });

    it("should update on change", () => {
      $scope.subscriptions = [];
      $scope.$digest();
      expect(el.querySelectorAll(".sub-label").length).toBe(0);
    });

    describe("saving", () => {
      beforeEach(() => {
        el.querySelectorAll("multi-toggler a")[2].click();
        el.querySelector(".save-btn").click();
      });

      it("should show the saving banner", () => {
        expect(el.querySelector(".alert-info")).not.toBeNull();
      });

      it("should patch with the right data", () => {
        expect(mockSocketStream).toHaveBeenCalledOnceWith(
          "/api/alert_subscription/",
          {
            method: "patch",
            json: {
              objects: [{ user: "/api/user/2", alert_type: "/api/alert_type/26/" }],
              deleted_objects: ["/api/alert_subscription/45/"]
            }
          },
          true
        );
      });

      it("should hide the saving banner after completion", () => {
        socket$.write(null);
        expect(el.querySelector(".alert-info")).toBeNull();
      });
    });
  });
});
