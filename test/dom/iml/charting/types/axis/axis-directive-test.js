import highland from "highland";
import d3 from "d3";
import angular from "../../../../../angular-mock-setup.js";
import * as fp from "@iml/fp";
import * as maybe from "@iml/maybe";
import { charterDirective } from "../../../../../../source/iml/charting/types/chart/chart-directive.js";
import { axisDirective } from "../../../../../../source/iml/charting/types/axis/axis-directive.js";
import { flushD3Transitions } from "../../../../../test-utils.js";

describe("axis directive", () => {
  let $scope, el, qs, axis;

  beforeEach(
    angular.mock.module($compileProvider => {
      $compileProvider.directive("charter", charterDirective);
      $compileProvider.directive("axis", axisDirective);
    })
  );

  beforeEach(
    angular.mock.inject(($rootScope, $compile) => {
      HTMLElement.prototype.transform = {
        baseVal: {
          consolidate: jest.fn()
        }
      };

      const template = `
      <div charter stream="stream" on-update="onUpdate">
        <g axis scale="scale" orient="'bottom'"></g>
      </div>
    `;

      $scope = $rootScope.$new();
      $scope.stream = highland();
      $scope.stream.write([1, 2, 3, 4]);
      $scope.onUpdate = [];
      $scope.scale = d3.scale
        .linear()
        .domain([0, 4])
        .range([0, 200]);

      el = angular.element(template)[0];
      document.body.appendChild(el);
      d3.select(el).style({
        display: "inline-block",
        width: "200px",
        height: "200px"
      });

      $compile(el)($scope)[0];

      qs = expr => el.querySelector(expr);
      axis = qs.bind(null, ".axis");
      $scope.$digest();
    })
  );

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should append an axis group", () => {
    expect(axis()).not.toBeNull();
  });

  it("should set transform on axis", () => {
    expect(axis().getAttribute("transform")).toBe("translate(0,120)");
  });

  it("should have a lower tick", function() {
    expect(qs(".tick text").textContent).toEqual("0.0");
  });

  it("should have an upper tick", function() {
    expect(maybe.fromJust(fp.last([].slice.call(el.querySelectorAll(".tick text")))).textContent).toEqual("4.0");
  });

  it("should update on new data", function() {
    $scope.scale.domain([0, 3]);
    $scope.stream.write([0, 1, 2, 3]);

    flushD3Transitions(d3);

    expect(maybe.fromJust(fp.last([].slice.call(el.querySelectorAll(".tick text")))).textContent).toEqual("3.0");
  });
});
