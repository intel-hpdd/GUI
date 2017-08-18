import d3 from 'd3';
import highland from 'highland';
import * as fp from '@iml/fp';
import { lineDirective } from '../../../../../../source/iml/charting/types/line/line-directive.js';
import { charterDirective } from '../../../../../../source/iml/charting/types/chart/chart-directive.js';
import { flushD3Transitions } from '../../../../../test-utils.js';
import angular from '../../../../../angular-mock-setup.js';

describe('line directive', () => {
  let chartCtrl;

  beforeEach(
    angular.mock.module($compileProvider => {
      Element.prototype.getTotalLength = () => 0;
      $compileProvider.directive('line', lineDirective);
      $compileProvider.directive('charter', charterDirective);
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

  afterEach(() => {
    delete Element.prototype.getTotalLength;
  });

  let $scope, el, qs;

  beforeEach(
    angular.mock.inject(($rootScope, $compile) => {
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

    flushD3Transitions(d3);

    expect(qs('.line').style.strokeOpacity).toBe('0');
  });

  it('should not change opactivy on non-legend event', () => {
    chartCtrl.dispatch.event('zelda', [
      {
        foo: true
      }
    ]);

    flushD3Transitions(d3);

    expect(qs('.line').style.strokeOpacity).toBe('1');
  });

  it('should update stroke', () => {
    $scope.color = '#444444';
    $scope.$digest();

    chartCtrl.onUpdate[0]({
      svg: d3.select(qs('svg'))
    });

    flushD3Transitions(d3);

    expect(qs('.line').getAttribute('stroke')).toBe('#444444');
  });
});
