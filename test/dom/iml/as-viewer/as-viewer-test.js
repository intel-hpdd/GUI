import highland from 'highland';
import * as fp from 'intel-fp';
import broadcaster from '../../../../source/iml/broadcaster.js';
import asViewerDirective from '../../../../source/iml/as-viewer/as-viewer.js';

describe('as viewer', () => {
  let $compile, $scope, el, s, getText, v;

  beforeEach(
    module($compileProvider => {
      $compileProvider.directive('asViewer', asViewerDirective);
    })
  );

  describe('with transform', () => {
    beforeEach(
      inject(($rootScope, _$compile_) => {
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
          spyOn(v, 'destroy').and.callThrough();
          v.each(function(x) {
            $scope.num = x;
          });
        };

        el = $compile(template)($scope);
        $scope.$digest();

        const find = el[0].querySelector.bind(el[0]);
        getText = fp.flow(find, fp.view(fp.lensProp('textContent')));
      })
    );

    it('should add 2 to num', () => {
      s.write(1);
      $scope.$digest();

      expect(getText('.num')).toEqual('3');
    });

    it('should destroy the viewer when scope is destroyed', () => {
      $scope.$destroy();

      expect(v.destroy).toHaveBeenCalled();
    });
  });

  describe('without transform', function() {
    beforeEach(
      inject(function($rootScope, _$compile_) {
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
        getText = fp.flow(find, fp.view(fp.lensProp('textContent')));
      })
    );

    describe('multiple children', function() {
      beforeEach(function() {
        s.write({
          a: 'eeey',
          b: 'bee'
        });
        $scope.$digest();
      });

      it('should set a', function() {
        expect(getText('.a')).toEqual('eeey');
      });

      it('should set b', function() {
        expect(getText('.b')).toEqual('bee');
      });

      describe('on destroy b', function() {
        beforeEach(function() {
          $scope.$$childTail.$destroy();
          s.write({
            a: 'a',
            b: 'b'
          });
          $scope.$digest();
        });

        it('should update a', function() {
          expect(getText('.a')).toEqual('a');
        });

        it('should not update b', function() {
          expect(getText('.b')).toEqual('bee');
        });
      });
    });

    describe('adding a child', function() {
      beforeEach(function() {
        const template = '<div as-viewer stream="stream">\
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
          a: 'a',
          b: 'b',
          c: 'c'
        });
        $scope.$digest();
      });

      it('should update a', function() {
        expect(getText('.a')).toEqual('a');
      });

      it('should update b', function() {
        expect(getText('.b')).toEqual('b');
      });

      it('should update c', function() {
        expect(getText('.c')).toEqual('c');
      });
    });
  });
});
