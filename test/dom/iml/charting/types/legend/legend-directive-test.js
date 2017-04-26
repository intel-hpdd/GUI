import highland from 'highland';
import { legendDirective } from '../../../../../../source/iml/charting/types/legend/legend-directive.js';
import { charterDirective } from '../../../../../../source/iml/charting/types/chart/chart-directive.js';
import { getLegendFactory } from '../../../../../../source/iml/charting/types/legend/get-legend.js';
import d3 from 'd3';
import angular from '../../../../../angular-mock-setup.js';

describe('legend directive', () => {
  let chartCtrl;

  beforeEach(
    angular.mock.module(($compileProvider, $provide) => {
      $compileProvider.directive('legend', legendDirective);
      $compileProvider.directive('charter', charterDirective);
      $provide.factory('getLegend', getLegendFactory);
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
    angular.mock.inject(($rootScope, $compile) => {
      const template = `
      <div charter stream="stream">
        <g tester class="tester"></g>
        <g legend scale="scale"></g>
      </div>
    `;

      $scope = $rootScope.$new();
      $scope.stream = highland();
      $scope.scale = d3.scale
        .ordinal()
        .domain(['running actions', 'waiting requests', 'idle workers'])
        .range(['#F3B600', '#A3B600', '#0067B4']);

      el = $compile(template)($scope)[0];
      document.body.appendChild(el);

      d3.select(el).style({
        display: 'inline-block',
        width: '200px',
        height: '200px'
      });
      qs = expr => el.querySelector(expr);

      $scope.$digest();
      $scope.stream.write(1);
    })
  );

  afterEach(() => document.body.removeChild(el));

  it('should append three legend groups', () => {
    expect(el.querySelectorAll('.legend-group').length).toBe(3);
  });

  it('should dispatch a legend selection', () => {
    const spy = jest.fn();

    chartCtrl.dispatch.on('event', spy);

    qs('.legend-group').dispatchEvent(new MouseEvent('click'));

    expect(spy).toHaveBeenCalledOnceWith('legend', [
      {
        'running actions': true
      }
    ]);
  });
});
