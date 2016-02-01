import {flow, lensProp, view} from 'intel-fp';
import highland from 'highland';
import asValueModule from '../../../../source/iml/as-value/as-value-module';

describe('As value', () => {
  beforeEach(module(asValueModule));

  var $compile, $scope, el, s, getText;

  beforeEach(inject(function ($rootScope, _$compile_) {
    $compile = _$compile_;

    var template = '<div as-value stream="stream">\
      <span class="num" >{{ curr.val }}</span>\
    </div>';

    $scope = $rootScope.$new();
    s = highland();
    $scope.stream = s;

    $scope.setNum = function setNum (s) {
      s.each(function (x) {
        $scope.num = x;
      });
    };

    el = $compile(template)($scope);
    $scope.$digest();

    var find = el[0].querySelector.bind(el[0]);
    getText = flow(find, view(lensProp('textContent')));
  }));

  it('should be empty to start', function () {
    expect(getText('.num')).toEqual('');
  });

  it('should output num', function () {
    s.write(1);
    expect(getText('.num')).toEqual('1');
  });

  it('should output a stream of nums', function () {
    s.write(1);
    s.write(2);
    s.end();
    expect(getText('.num')).toEqual('2');
  });
});
