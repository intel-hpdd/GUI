import {chartCompilerFactory}
  from '../../../../source/chroma_ui/iml/chart-compiler/chart-compiler-exports';

describe('chart compiler', () => {
  var chartCompiler, compilerPromise, getTemplatePromise, s, chartFn;

  beforeEach(module('charting'));

  beforeEach(inject(($compile, $q, resolveStream) => {
    s = highland();

    chartFn = jasmine.createSpy('chartFn')
    .andReturn('chartObj');

    getTemplatePromise = jasmine.createSpy('getTemplatePromise')
      .andReturn($q.when('<div class="template">foo</div>'));

    chartCompiler = chartCompilerFactory($compile, $q, getTemplatePromise, resolveStream);
    compilerPromise = chartCompiler('template/path', s, chartFn);
  }));

  it('should return a function', () => {
    expect(chartCompiler).toEqual(jasmine.any(Function));
  });

  it('should call getTemplatePromise', () => {
    expect(getTemplatePromise)
      .toHaveBeenCalledOnceWith('template/path');
  });

  it('should return back a promise', () => {
    expect(compilerPromise).toBeAPromise();
  });

  describe('resolving promise', () => {
    var node, compiler, $scope;

    beforeEach(inject(($rootScope) => {
      s.write('foo');

      compilerPromise
        .then((c) => compiler = c);

      $scope = $rootScope.$new();

      $scope.$digest();

      node = compiler($scope);
    }));

    it('should be a compiled element', () => {
      expect(node).toHaveClass('template');
    });

    it('should call the chartFn', function () {
      expect(chartFn)
        .toHaveBeenCalledOnceWith($scope, jasmine.any(Object));
    });

    it('should set the chart on the scope', () => {
      expect($scope.chart).toEqual('chartObj');
    });
  });
});
