describe('legend directive', () => {
  var chartCtrl;

  beforeEach(window.module('chart', 'templates', 'legend', ($compileProvider) => {
    $compileProvider.directive('tester', () => {
      return {
        require: '^^charter',
        link ($scope, el, attr, ctrl) {
          chartCtrl = ctrl;
        }
      }
    });
  }));

  var $scope, el, qs;

  beforeEach(inject(($rootScope, $compile) => {
    const template = `
      <div charter stream="stream">
        <g tester class="tester"></g>
        <g legend scale="scale"></g>
      </div>
    `;

    $scope = $rootScope.$new();
    $scope.stream = highland([1]);
    $scope.scale =  d3.scale.ordinal()
      .domain(['running actions', 'waiting requests', 'idle workers'])
      .range(['#F3B600', '#A3B600', '#0067B4']);

    el = $compile(template)($scope)[0];
    d3.select(el)
      .style({
        display: 'inline-block',
        width: '200px',
        height: '200px'
      });
    qs = fp.flow(
      fp.arrayWrap,
      fp.invokeMethod('querySelector', fp.__, el)
    );
    $scope.$digest();
  }));

  it('should append three legend groups', () => {
    expect(el.querySelectorAll('.legend-group').length).toBe(3);
  });

  it('should dispatch a legend selection', () => {
    var spy = jasmine.createSpy('spy');

    chartCtrl.dispatch.on('event', spy);

    qs('.legend-group')
      .dispatchEvent(new MouseEvent('click'));

    expect(spy)
      .toHaveBeenCalledOnceWith('legend', [{
        'running actions': true
      }]);
  });
});
