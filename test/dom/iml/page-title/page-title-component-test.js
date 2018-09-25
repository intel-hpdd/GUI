import * as maybe from "@iml/maybe";
import angular from "../../../angular-mock-setup.js";

describe("page title component", () => {
  let $state,
    $transitions,
    pageTitleComponent,
    mockGetResolvedData,
    $scope,
    $compile,
    template,
    el,
    link,
    linkIcon,
    destroyOnStart,
    destroyOnSuccess;

  beforeEach(() => {
    mockGetResolvedData = jest.fn();

    jest.mock("../../../../source/iml/route-utils", () => ({
      getResolvedData: mockGetResolvedData
    }));

    pageTitleComponent = require("../../../../source/iml/page-title/page-title-component.js").default;
  });

  beforeEach(
    angular.mock.module(($compileProvider, $provide) => {
      $state = {
        router: {
          globals: {
            $current: {
              name: "app.dashboard.overview",
              data: { kind: "Dashboard", icon: "icon1" }
            }
          }
        }
      };
      destroyOnStart = jest.fn();
      destroyOnSuccess = jest.fn();

      $transitions = {
        onStart: jest.fn(() => destroyOnStart),
        onSuccess: jest.fn().mockReturnValue(destroyOnSuccess)
      };

      $provide.value("$state", $state);
      $provide.value("$transitions", $transitions);
      $compileProvider.component("pageTitle", pageTitleComponent);
    })
  );

  beforeEach(
    angular.mock.inject((_$compile_, $rootScope) => {
      $scope = $rootScope.$new();
      $compile = _$compile_;
      template = "<page-title></page-title>";
    })
  );

  describe("when the transition starts", () => {
    beforeEach(() => {
      mockGetResolvedData.mockReturnValue(maybe.of({ label: "fs1", kind: "Dashboard" }));

      el = $compile(template)($scope)[0];
      $transitions.onStart.mock.calls[0][1]();
      $scope.$digest();
      link = el.querySelector("h3");
    });

    it("should display the loading class on h3", () => {
      expect(link.classList.contains("loading")).toBe(true);
    });
  });
  describe("after a successful transition", () => {
    beforeEach(() => {
      mockGetResolvedData.mockReturnValue(maybe.of({ label: "fs1", kind: "Dashboard" }));

      el = $compile(template)($scope)[0];
      mockGetResolvedData.mockReturnValue(maybe.of({ label: "fs1-MDT0000", kind: "Dashboard" }));

      const transition = {
        to: jest.fn(() => ({ data: { kind: "Dashboard", icon: "icon2" } }))
      };

      $transitions.onSuccess.mock.calls[0][1](transition);
      $scope.$digest();
      link = el.querySelector.bind(el, "h3");
      linkIcon = el.querySelector.bind(el, "h3 > i");
    });

    it("should not have a loading class on the h3", () => {
      expect(link().classList.contains("loading")).toBe(false);
    });

    it("should display the kind and label", () => {
      expect(link().textContent.trim()).toEqual("Dashboard : fs1-MDT0000");
    });

    it("should display the icon", () => {
      expect(linkIcon()).toHaveClass("icon2");
    });
  });
  describe("on destroy", () => {
    beforeEach(() => {
      mockGetResolvedData.mockReturnValue(maybe.of({ label: "fs1", kind: "Dashboard" }));

      el = $compile(template)($scope)[0];
      $scope.$digest();
      $scope.$destroy();
    });

    it("should destroy onStart", () => {
      expect(destroyOnStart).toHaveBeenCalledTimes(1);
    });

    it("should destroy onSuccess", () => {
      expect(destroyOnSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
