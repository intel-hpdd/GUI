// @flow

import { querySelector } from "../../../../source/iml/dom-utils.js";
import angular from "../../../angular-mock-setup.js";

import type { $scopeT, $compileT } from "angular";

describe("tree server item component", () => {
  let mod, mockToggleItem;

  beforeEach(() => {
    mockToggleItem = jest.fn();

    jest.mock("../../../../source/iml/tree/tree-utils", () => ({
      toggleItem: mockToggleItem
    }));

    mod = require("../../../../source/iml/tree/tree-server-item-component.js");
  });

  beforeEach(
    angular.mock.module($compileProvider => {
      $compileProvider.component("treeServerItem", mod.default);
    })
  );

  let el, $scope;
  beforeEach(
    angular.mock.inject(($compile: $compileT, $rootScope: $scopeT) => {
      $scope = Object.create($rootScope.$new());

      $scope.record = { id: 1, fqdn: "lotus-34vm3.lotus.hpdd.lab.intel.com" };
      $scope.parent = { treeId: 1, opens: {} };

      const template = '<tree-server-item parent="parent" record="record"></tree-server-item>';

      el = $compile(template)($scope)[0];
      $scope.$digest();
    })
  );

  it("should link to the server detail page", () => {
    const route = querySelector(el, "a").getAttribute("ui-sref");
    expect(route).toBe("app.serverDetail({ id: $ctrl.record.id, resetState: true })");
  });

  it("should link to the server dashboard page", () => {
    const route = querySelector(el, "a.dashboard-link").getAttribute("ui-sref");
    expect(route).toBe("app.dashboard.server({ id: $ctrl.record.id, resetState: true })");
  });

  it("should render the fqdn", () => {
    expect(querySelector(el, "a").textContent.trim()).toBe("lotus-34vm3.lotus.hpdd.lab.intel.com");
  });

  it("should not render any children", () => {
    expect(el.querySelector(".children")).toBeNull();
  });

  it("should start with arrow pointed right", () => {
    expect(el.querySelector("i.fa-chevron-right")).not.toHaveClass("fa-rotate-90");
  });

  describe("on click", () => {
    beforeEach(() => {
      const chevron = querySelector(el, "i.fa-chevron-right");
      chevron.click();
      $scope.parent.opens[1] = true;
      $scope.$digest();
    });

    it("should show the children", () => {
      expect(el.querySelector(".children")).not.toBeNull();
    });

    it("should show the volume collection", () => {
      expect(el.querySelector("tree-volume-collection")).not.toBeNull();
    });

    it("should call the store", () => {
      expect(mockToggleItem).toHaveBeenCalledOnceWith(1, 1, true);
    });
  });
});
