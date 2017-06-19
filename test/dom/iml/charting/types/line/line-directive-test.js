import d3 from 'd3';
import highland from 'highland';
import * as fp from '@mfl/fp';
import lineModule from '../../../../../../source/iml/charting/types/line/line-module';
import chartModule from '../../../../../../source/iml/charting/types/chart/chart-module';

describe('line directive', () => {
  let chartCtrl;

  beforeEach(
    module(lineModule, chartModule, $compileProvider => {
      $compileProvider.directive('tester', () => {
        return {
          require: '^^charter',
          link($scope, el, attr, ctrl) {
            chartCtrl = ctrl;
          }
        };
      });
    })
  );

  let $scope, el, qs;

  beforeEach(
    inject(($rootScope, $compile) => {
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

      $scope.stream = highland();
      $scope.onData = () => ['data'];

      el = $compile(template)($scope)[0];
      document.body.appendChild(el);

      qs = expr => el.querySelector(expr);
      $scope.$digest();
      $scope.stream.write([1, 2, 3, 4]);
    })
  );

  afterEach(() => document.body.removeChild(el));

  it('should append a line', () => {
    expect(qs('.line')).not.toBeNull();
  });

  it('should set stroke', () => {
    expect(qs('.line').getAttribute('stroke')).toBe('#333333');
  });

  it('should change opacity on legend event dispatch', () => {
    chartCtrl.dispatch.event('legend', [
      {
        foo: true
      }
    ]);

    window.flushD3Transitions();

    expect(qs('.line').style.strokeOpacity).toBe('0');
  });

  it('should not change opactivy on non-legend event', () => {
    chartCtrl.dispatch.event('zelda', [
      {
        foo: true
      }
    ]);

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
