describe('line directive', () => {
  var chartCtrl;

  beforeEach(window.module('chart', 'templates', 'line', ($compileProvider) => {
    $compileProvider.directive('tester', () => {
      return {
        require: '^^charter',
        link ($scope, el, attr, ctrl) {
          chartCtrl = ctrl;
        }
      }
    });
  }));

  var $scope, el, qs, label;

  beforeEach(inject(($rootScope, $compile) => {
    const template = `
      <div charter stream="stream">
        <g tester class="tester"></g>
        <g line scale-y="yScale" scale-x="xScale" value-x="xValue"
          value-y="yValue" color="color" comparator-x="xComparator"></g>
      </div>
    `;

    $scope = $rootScope.$new();
    $scope.yScale = d3.scale.linear();
    $scope.xScale = d3.scale.linear();
    $scope.xValue = fp.identity;
    $scope.yValue = fp.identity;
    $scope.xComparator = fp.eq;
    $scope.color = '#333333';

    $scope.stream = highland([[1, 2, 3, 4]]);
    $scope.onData = () => ['data'];

    el = $compile(template)($scope)[0];
    qs = fp.flow(
      fp.arrayWrap,
      fp.invokeMethod('querySelector', fp.__, el)
    );
    label = qs.bind(null, '.label-group');
    $scope.$digest();
  }));

  it('should append a line', () => {
    expect(qs('.line')).not.toBeNull();
  });

  it('should set stroke', () => {
    expect(qs('.line').getAttribute('stroke')).toBe('#333333');
  });

  it('should change opacity on legend event dispatch', () => {
    chartCtrl.dispatch.event('legend', [{
      foo: true
    }]);

    window.flushD3Transitions();

    expect(qs('.line').style.strokeOpacity).toBe('0');
  });

  it('should not change opactivy on non-legend event', () => {
    chartCtrl.dispatch.event('zelda', [{
      foo: true
    }]);

    window.flushD3Transitions();

    expect(qs('.line').style.strokeOpacity).toBe('1');
  });

  it('should update stroke', () => {
    $scope.color = '#444444';
    $scope.$digest();

    fp.head(chartCtrl.onUpdate)({
      svg: d3.select(qs('svg'))
    });

    window.flushD3Transitions();

    expect(qs('.line').getAttribute('stroke')).toBe('#444444');
  });
});
