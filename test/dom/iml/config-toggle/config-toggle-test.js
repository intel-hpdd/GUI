import configToggle from "../../../../source/iml/config-toggle/config-toggle.js";
import angular from "../../../angular-mock-setup.js";

describe("config toggle", () => {
  beforeEach(
    angular.mock.module($compileProvider => {
      $compileProvider.directive("configToggle", configToggle);
    })
  );

  let template, el, $scope, whenInactive, whenActive, setActive, setInactive;
  beforeEach(
    angular.mock.inject(($compile, $rootScope) => {
      template = `<div class="wrap" config-toggle> <div class="when-inactive" ng-if="configToggle.inactive()"> <button class="set-active" ng-click="configToggle.setActive()">Set Active</button> </div> <div class="when-active" ng-if="configToggle.active()"> <button class="set-inactive" ng-click="configToggle.setInactive()" class="btn btn-cancel btn-block">Cancel</button> </div></div>`;
      $scope = $rootScope.$new();
      el = $compile(template)($scope)[0];
      $scope.$digest();
      whenInactive = el.querySelector.bind(el, ".when-inactive");
      whenActive = el.querySelector.bind(el, ".when-active");
      setActive = el.querySelector.bind(el, ".set-active");
      setInactive = el.querySelector.bind(el, ".set-inactive");
    })
  );
  it("should show inactive", () => {
    expect(whenInactive()).not.toBeNull();
  });
  it("should not show active", () => {
    expect(whenActive()).toBeNull();
  });
  describe("set active", () => {
    beforeEach(() => {
      setActive().click();
      setInactive().click();
    });
    it("should show inactive", () => {
      expect(whenInactive()).not.toBeNull();
    });
    it("should not show active", () => {
      expect(whenActive()).toBeNull();
    });
  });
});
