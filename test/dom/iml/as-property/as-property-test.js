import angular from 'angular';
const {module, inject} = angular.mock;

import {flow, lensProp} from 'intel-fp/fp';

describe('as property', function () {
  beforeEach(module('asProperty', 'highland'));

  var $compile, $scope, el, s, getText;

  describe('with transform', function () {
    beforeEach(inject(function ($rootScope, _$compile_, addProperty) {
      $compile = _$compile_;

      var template = '<div as-property stream="stream" args="args" transform="add1(stream, args)">\
        <span class="num" ng-init="setNum(prop.stream)">{{ num }}</span>\
      </div>';

      $scope = $rootScope.$new();
      s = highland();
      $scope.stream = s
        .through(addProperty);

      $scope.args = [2];

      $scope.add1 = function add1 (s, args) {
        return s.map(highland.add.apply(highland, args));
      };

      $scope.setNum = function setNum (s) {
        s.each(function (x) {
          $scope.num = x;
        });
      };

      el = $compile(template)($scope);
      $scope.$digest();

      var find = el[0].querySelector.bind(el[0]);
      getText = flow(find, lensProp('textContent'));
    }));

    it('should add 2 to num', function () {
      s.write(1);
      $scope.$digest();

      expect(getText('.num')).toEqual('3');
    });
  });

  describe('without transform', function () {
    beforeEach(inject(function ($rootScope, _$compile_, addProperty) {
      $compile = _$compile_;

      var template = '<div>\
      <div as-property stream="stream">\
        <span class="a" ng-init="setA(prop.stream)">{{ a }}</span>\
      </div>\
      <div as-property stream="stream">\
        <span class="b" ng-init="setB(prop.stream)">{{ b }}</span>\
      </div>\
    </div>';

      $scope = $rootScope.$new();
      s = highland();
      $scope.stream = s
        .through(addProperty);

      $scope.setA = function getA (s) {
        s.each(function  (x) {
          $scope.a = x.a;
        });
      };

      $scope.setB = function getB (s) {
        s.each(function  (x) {
          $scope.b = x.b;
        });
      };

      el = $compile(template)($scope);
      $scope.$digest();

      var find = el[0].querySelector.bind(el[0]);
      getText = flow(find, lensProp('textContent'));
    }));

    describe('multiple children', function () {
      beforeEach(function () {
        $scope.stream.write({
          a: 'eeey',
          b: 'bee'
        });
        $scope.$digest();
      });

      it('should set a', function () {
        expect(getText('.a')).toEqual('eeey');
      });

      it('should set b', function () {
        expect(getText('.b')).toEqual('bee');
      });

      describe('on destroy b', function () {
        beforeEach(function () {
          $scope.$$childTail.$destroy();
          s.write({
            a: 'a',
            b: 'b'
          });
          $scope.$digest();
        });

        it('should update a', function () {
          expect(getText('.a')).toEqual('a');
        });

        it('should not update b', function () {
          expect(getText('.b')).toEqual('bee');
        });
      });
    });

    describe('adding a child', function () {
      beforeEach(function () {
        var template = '<div as-property stream="stream">\
        <span class="c" ng-init="setC(prop.stream)">{{ c }}</span>\
      </div>';

        $scope.setC = function setC (s) {
          s.each(function (x) {
            $scope.c = x.c;
          });
        };

        var child = $compile(template)($scope);
        el[0].appendChild(child[0]);
        s.write({
          a: 'a',
          b: 'b',
          c: 'c'
        });
        $scope.$digest();
      });

      it('should update a', function () {
        expect(getText('.a')).toEqual('a');
      });

      it('should update b', function () {
        expect(getText('.b')).toEqual('b');
      });

      it('should update c', function () {
        expect(getText('.c')).toEqual('c');
      });
    });
  });
});
