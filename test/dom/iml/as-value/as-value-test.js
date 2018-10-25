import * as fp from "@iml/fp";
import highland from "highland";
import angular from "../../../angular-mock-setup.js";
import asValueModule from "../../../../source/iml/as-value/as-value-module";
import { render } from "inferno";
import { asValue } from "../../../../source/iml/as-value/as-value.js";

describe("As value Inferno", () => {
  let el, s, getText;

  beforeEach(() => {
    s = highland();

    el = document.createElement("div");

    const AsValue = asValue("curr", ({ curr }) => (
      <div>
        <span class="num">{curr}</span>
      </div>
    ));

    render(<AsValue stream={s} />, el);

    const find = el.querySelector.bind(el);
    getText = fp.flow(
      find,
      fp.view(fp.lensProp("textContent"))
    );
  });

  it("should be empty to start", function() {
    expect(getText(".num")).toEqual("");
  });

  it("should output num", function() {
    s.write(1);
    expect(getText(".num")).toEqual("1");
  });

  it("should output a stream of nums", function() {
    s.write(1);
    s.write(2);
    s.end();
    expect(getText(".num")).toEqual("2");
  });
});

describe("As value", () => {
  beforeEach(angular.mock.module(asValueModule));

  let $compile, $scope, el, s, getText;

  beforeEach(
    angular.mock.inject(function($rootScope, _$compile_) {
      $compile = _$compile_;

      const template = '<div as-value stream="stream">\
      <span class="num" >{{ curr.val }}</span>\
    </div>';

      $scope = $rootScope.$new();
      s = highland();
      $scope.stream = s;

      $scope.setNum = function setNum(s) {
        s.each(function(x) {
          $scope.num = x;
        });
      };

      el = $compile(template)($scope);
      $scope.$digest();

      const find = el[0].querySelector.bind(el[0]);
      getText = fp.flow(
        find,
        fp.view(fp.lensProp("textContent"))
      );
    })
  );

  it("should be empty to start", function() {
    expect(getText(".num")).toEqual("");
  });

  it("should output num", function() {
    s.write(1);
    expect(getText(".num")).toEqual("1");
  });

  it("should output a stream of nums", function() {
    s.write(1);
    s.write(2);
    s.end();
    expect(getText(".num")).toEqual("2");
  });
});
