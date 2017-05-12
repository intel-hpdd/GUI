import * as fp from '@mfl/fp';
import highland from 'highland';
import angular from '../../../angular-mock-setup.js';
import asStreamModule from '../../../../source/iml/as-stream/as-stream-module';
import asValueModule from '../../../../source/iml/as-value/as-value-module';

describe('As stream', () => {
  let s;

  beforeEach(
    angular.mock.module(asStreamModule, asValueModule, function($provide) {
      $provide.value('highland', function() {
        s = highland();

        spyOn(s, 'destroy');

        return s;
      });
    })
  );

  let $scope, $rootScope, el, getText, compile;

  beforeEach(
    inject(function(_$rootScope_, $compile) {
      $rootScope = _$rootScope_;

      const template =
        '<div as-stream val="val">\
      <span class="txt" as-value stream="str">\
        {{ curr.val }}\
      </span>\
    </div>';

      $scope = $rootScope.$new();
      $scope.val = 'foo';

      compile = function compiler($scope) {
        const el = $compile(template)($scope);
        $scope.$digest();

        return el;
      };

      el = compile($scope);

      const find = el[0].querySelector.bind(el[0]);
      getText = fp.flow(find, x => x.textContent.trim());
    })
  );

  it('should throw if str is already on scope', function() {
    $scope = $rootScope.$new();
    $scope.str = 'food';

    expect(compile.bind(null, $scope)).toThrow(
      new Error('str already set on transcluded scope.')
    );
  });

  it('should be foo to start', function() {
    expect(getText('.txt')).toEqual('foo');
  });

  it('should update to bar', function() {
    $scope.val = 'bar';
    $scope.$digest();
    expect(getText('.txt')).toEqual('bar');
  });

  it('should destroy the stream on scope destruction', function() {
    $scope.$destroy();

    expect(s.destroy).toHaveBeenCalledTimes(1);
  });
});
