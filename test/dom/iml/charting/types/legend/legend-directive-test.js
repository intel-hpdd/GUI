import highland from 'highland';
import legendModule
  from '../../../../../../source/iml/charting/types/legend/legend-module';
import chartModule
  from '../../../../../../source/iml/charting/types/chart/chart-module';

describe('legend directive', () => {
  let chartCtrl;

  beforeEach(
    module(chartModule, legendModule, $compileProvider => {
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
    inject(($rootScope, $compile, d3) => {
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
    const spy = jasmine.createSpy('spy');

    chartCtrl.dispatch.on('event', spy);

    qs('.legend-group').dispatchEvent(new MouseEvent('click'));

    expect(spy).toHaveBeenCalledOnceWith('legend', [
      {
        'running actions': true
      }
    ]);
  });
});
