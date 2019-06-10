import angular from "../../../angular-mock-setup.js";

import uiBootstrapModule from "angular-ui-bootstrap";

describe("deferred action dropdown", () => {
  let data, mod;
  let mockFetchApi, mockGetRandomValues, mockGlobal;
  beforeEach(() => {
    data = { key: "val" };
    mockFetchApi = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        foo: "bar",
        json: data
      })
    );
    jest.mock("../../../../source/iml/fetch-api.js", () => mockFetchApi);

    mockGetRandomValues = jest.fn(() => 12345);
    jest.mock("../../../../source/iml/get-random-value.js", () => mockGetRandomValues);

    mockGlobal = {
      wasm_bindgen: {
        action_dropdown: jest.fn()
      }
    };
    jest.mock("../../../../source/iml/global.js", () => mockGlobal);

    mod = require("../../../../source/iml/status/deferred-action-dropdown.js");
  });

  beforeEach(() => {
    if (!window.angular) require("angular");
  });

  beforeEach(
    angular.mock.module(uiBootstrapModule, ($controllerProvider, $compileProvider) => {
      const { actionDropdown } = require("../../../../source/iml/action-dropdown/action-dropdown.js");

      $compileProvider.component("actionDropdown", actionDropdown);

      $compileProvider.component("deferredActionDropdown", mod.deferredActionDropdownComponent);
    })
  );

  let el, $scope, qs, actionDropdown;

  beforeEach(
    angular.mock.inject(($rootScope, $compile) => {
      const template = '<deferred-action-dropdown row="::row" locks="locks"></deferred-action-dropdown>';

      $scope = $rootScope.$new();
      $scope.row = {
        affected: ["thing1"]
      };
      $scope.locks = {};

      el = $compile(template)($scope)[0];
      qs = el.querySelector.bind(el);
      actionDropdown = qs.bind(el, "action-dropdown");
      $scope.$digest();

      document.body.appendChild(el);
    })
  );

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should show the action dropdown", () => {
    expect(actionDropdown()).toBeShown();
  });

  describe("when moused over", () => {
    beforeEach(() => {
      const event = new MouseEvent("mouseover", {
        clientX: 50,
        clientY: 50,
        bubbles: true
      });
      actionDropdown().dispatchEvent(event);
      $scope.$apply();
    });

    it("should fetch the api", () => {
      expect(mockFetchApi).toHaveBeenCalledTimes(1);
      expect(mockFetchApi).toHaveBeenCalledWith("thing1");
    });

    it("should apply the records to the scope", () => {
      expect($scope.$$childTail.$ctrl.records).toEqual([{ key: "val" }]);
    });
  });
});
