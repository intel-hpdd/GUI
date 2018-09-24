// @flow

import angular from "../../../angular-mock-setup.js";
import type { $scopeT, $compileT } from "angular";

import filtersModule from "../../../../source/iml/filters/filters-module.js";

describe("tree server item component", () => {
  let mod;

  beforeEach(() => {
    mod = require("../../../../source/iml/tree/tree-volume-item-component.js");
  });

  beforeEach(
    angular.mock.module(filtersModule, $compileProvider => {
      $compileProvider.component("treeVolumeItem", mod.default);
    })
  );

  let el, $scope;

  beforeEach(
    angular.mock.inject(($compile: $compileT, $rootScope: $scopeT) => {
      $scope = Object.create($rootScope.$new());

      $scope.record = {
        id: 1,
        label: "disk1",
        size: 100000
      };

      $scope.parent = {
        treeId: 1,
        opens: {}
      };

      const template = '<tree-volume-item parent="parent" record="record"></tree-volume-item>';

      el = $compile(template)($scope)[0];
      $scope.$digest();
    })
  );

  it("should render the label", () => {
    expect(el.textContent.trim()).toBe("disk1 (97.66 kB)");
  });
});
