import highland from "highland";
import broadcaster from "../../../../source/iml/broadcaster.js";
import pacemakerModule from "../../../../source/iml/pacemaker/pacemaker-module";
import asViewerDirective from "../../../../source/iml/as-viewer/as-viewer.js";
import angular from "../../../angular-mock-setup.js";

describe("configure pacemaker", () => {
  beforeEach(
    angular.mock.module(pacemakerModule, $compileProvider => {
      $compileProvider.directive("asViewer", asViewerDirective);
    })
  );

  let el, $scope, query, s;
  beforeEach(
    angular.mock.inject(($rootScope, $compile) => {
      const template = `<configure-pacemaker stream="::stream" alert-stream="::alertStream" locks="locks"></configure-pacemaker>`;
      s = highland();
      $scope = $rootScope.$new();
      $scope.stream = broadcaster(s);
      $scope.alertStream = highland();
      $scope.locks = [];
      el = $compile(template)($scope)[0];
      query = el.querySelector.bind(el);
      $scope.$digest();
    })
  );

  it("should not render if stream has no data", () => {
    expect(query(".section-header")).toBeNull();
  });

  it("should not render if stream has falsey data", () => {
    s.write(null);
    expect(query(".section-header")).toBeNull();
  });

  it("should render if stream has data", () => {
    s.write({});
    expect(query(".section-header")).not.toBeNull();
  });
});
