import highland from "highland";
import * as fp from "@iml/fp";
import angular from "../../../angular-mock-setup.js";
import broadcaster from "../../../../source/iml/broadcaster.js";
import { default as asViewerDirective, asViewers } from "../../../../source/iml/as-viewer/as-viewer.js";
import Inferno from "inferno";

describe("as viewer", () => {
  let $compile, $scope, el, s, getText, v;

  beforeEach(
    angular.mock.module($compileProvider => {
      $compileProvider.directive("asViewer", asViewerDirective);
    })
  );

  describe("with transform", () => {
    beforeEach(
      angular.mock.inject(($rootScope, _$compile_) => {
        $compile = _$compile_;

        const template = `
        <div as-viewer stream="stream" args="args" transform="add1(stream, args)">
          <span class="num" ng-init="setNum(viewer)">{{ num }}</span>
        </div>
      `;

        $scope = $rootScope.$new();

        s = highland();
        $scope.stream = broadcaster(s);

        $scope.args = [2];

        $scope.add1 = function add1(s, args) {
          return s.map(highland.add.apply(highland, args));
        };

        $scope.setNum = function setNum(s) {
          v = s;
          jest.spyOn(v, "destroy");
          v.each(function(x) {
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

    it("should add 2 to num", () => {
      s.write(1);
      $scope.$digest();

      expect(getText(".num")).toEqual("3");
    });

    it("should destroy the viewer when scope is destroyed", () => {
      $scope.$destroy();

      expect(v.destroy).toHaveBeenCalled();
    });
  });

  describe("without transform", function() {
    beforeEach(
      angular.mock.inject(function($rootScope, _$compile_) {
        $compile = _$compile_;

        const template = `
        <div>
          <div as-viewer stream="stream">
            <span class="a" ng-init="setA(viewer)">{{ a }}</span>
          </div>
          <div as-viewer stream="stream">
            <span class="b" ng-init="setB(viewer)">{{ b }}</span>
          </div>
      </div>
    `;

        $scope = $rootScope.$new();
        s = highland();
        $scope.stream = broadcaster(s);

        $scope.setA = function setA(s) {
          s.each(function(x) {
            $scope.a = x.a;
          });
        };

        $scope.setB = function setB(s) {
          s.each(function(x) {
            $scope.b = x.b;
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

    describe("multiple children", function() {
      beforeEach(function() {
        s.write({
          a: "eeey",
          b: "bee"
        });
        $scope.$digest();
      });

      it("should set a", function() {
        expect(getText(".a")).toEqual("eeey");
      });

      it("should set b", function() {
        expect(getText(".b")).toEqual("bee");
      });

      describe("on destroy b", function() {
        beforeEach(function() {
          $scope.$$childTail.$destroy();
          s.write({
            a: "a",
            b: "b"
          });
          $scope.$digest();
        });

        it("should update a", function() {
          expect(getText(".a")).toEqual("a");
        });

        it("should not update b", function() {
          expect(getText(".b")).toEqual("bee");
        });
      });
    });

    describe("adding a child", function() {
      beforeEach(function() {
        const template =
          '<div as-viewer stream="stream">\
        <span class="c" ng-init="setC(viewer)">{{ c }}</span>\
      </div>';

        $scope.setC = function setC(s) {
          s.each(function(x) {
            $scope.c = x.c;
          });
        };

        const child = $compile(template)($scope);
        el[0].appendChild(child[0]);
        s.write({
          a: "a",
          b: "b",
          c: "c"
        });
        $scope.$digest();
      });

      it("should update a", function() {
        expect(getText(".a")).toEqual("a");
      });

      it("should update b", function() {
        expect(getText(".b")).toEqual("b");
      });

      it("should update c", function() {
        expect(getText(".c")).toEqual("c");
      });
    });
  });
});

describe("as viewers", () => {
  let root, viewer1B, viewer1V, viewer2B, viewer2V, viewer3B, viewer3V, MultipleViewersComponent;

  describe("with proper args", () => {
    beforeEach(() => {
      viewer1B = broadcaster(highland([{ viewer1: { key1: "val1" } }]));
      viewer1V = viewer1B();
      jest.spyOn(viewer1V, "destroy");
      viewer2B = broadcaster(highland([{ viewer2: { key2: "val2" } }]));
      viewer2V = viewer2B();
      jest.spyOn(viewer2V, "destroy");
      viewer3B = broadcaster(highland([{ viewer3: { key3: "val3" } }]));
      viewer3V = viewer3B();
      jest.spyOn(viewer3V, "destroy");

      MultipleViewersComponent = asViewers(
        ["viewer1", "viewer2", "viewer3"],
        ({ viewer1: { key1 }, viewer2: { key2 }, viewer3: { key3 }, name }) => {
          return (
            <div id="multiple-viewers-component">
              <h1 id="name">{name}</h1>
              <div id="key1">{key1}</div>
              <div id="key2">{key2}</div>
              <div id="key3">{key3}</div>
            </div>
          );
        }
      );

      root = document.createElement("div");
      Inferno.render(
        <MultipleViewersComponent viewers={[viewer1V, viewer2V, viewer3V]} name={"test-component"} />,
        root
      );
    });

    it("should match the snapshot", () => {
      expect(root).toMatchSnapshot();
    });

    describe("removing the component", () => {
      beforeEach(() => {
        Inferno.render(null, root);
      });

      it("should end the broadcast for viewer1", () => {
        expect(viewer1V.destroy).toHaveBeenCalledTimes(1);
      });

      it("should end the broadcast for viewer2", () => {
        expect(viewer2V.destroy).toHaveBeenCalledTimes(1);
      });

      it("should end the broadcast for viewer3", () => {
        expect(viewer3V.destroy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("with duplicate keys", () => {
    beforeEach(() => {});

    it("should throw an exception", () => {
      expect(
        () =>
          (MultipleViewersComponent = asViewers(["viewer1", "viewer2", "viewer3", "viewer3"], () => {
            return <div id="multiple-viewers-component" />;
          }))
      ).toThrow(new Error("asViewers keys must be unique."));
    });
  });
});
