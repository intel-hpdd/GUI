import λ from 'highland';
import {noop} from 'intel-fp';
import chartCompilerModule from '../../../../source/iml/chart-compiler/chart-compiler-module';
import {chartCompilerFactory}
  from '../../../../source/iml/chart-compiler/chart-compiler';

describe('chart compiler', () => {
  var chartCompiler, compilerPromise, getTemplatePromise, s, chartFn;

  beforeEach(module(chartCompilerModule));

  beforeEach(inject(($compile, addProperty, rebindDestroy) => {
    s = λ();

    chartFn = jasmine.createSpy('chartFn')
      .and.returnValue('chartObj');

    getTemplatePromise = jasmine.createSpy('getTemplatePromise')
      .and.returnValue(Promise.resolve('<div class="template">foo</div>'));

    chartCompiler = chartCompilerFactory($compile, getTemplatePromise,
      addProperty, rebindDestroy);
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

  describe('recompiling', () => {
    var node, compiler,
      $scope, s1, s2, spy;

    beforeEach(inject(($rootScope) => {
      $scope = $rootScope.$new();
    }));

    beforeEachAsync(async function () {
      spy = jasmine.createSpy('spy');

      s.write('foo');

      compiler = await compilerPromise;

      $scope.$digest();

      compiler($scope);
      s1 = chartFn.calls.mostRecent().args[1];
      node = compiler($scope);
      s2 = chartFn.calls.mostRecent().args[1];
    });

    it('should work when compile called again', () => {
      expect(node).toHaveClass('template');
    });

    it('should call chartFn twice', () => {
      expect(chartFn)
        .toHaveBeenCalledTwice();
    });

    it('should write to stream1', () => {
      s1.each(spy);
      s2.each(noop);

      expect(spy)
        .toHaveBeenCalledOnceWith('foo');
    });

    it('should write to stream1', () => {
      s1.each(noop);
      s2.each(spy);

      expect(spy)
        .toHaveBeenCalledOnceWith('foo');
    });

    it('should work when other instances are destroyed', () => {
      s1.destroy();
      s2.destroy();

      compiler($scope);
      const s3 = chartFn.calls.mostRecent().args[1];

      s3.each(spy);

      expect(spy)
        .toHaveBeenCalledOnceWith('foo');
    });
  });

  describe('resolving promise', () => {
    var node, compiler, $scope;

    beforeEach(inject(($rootScope) => {
      $scope = $rootScope.$new();
    }));

    beforeEachAsync(async function () {
      s.write('foo');

      compiler = await compilerPromise;

      $scope.$digest();

      node = compiler($scope);
    });

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

    it('should set chart to null on destroy', () => {
      $scope.$destroy();

      expect($scope.chart).toBeNull();
    });
  });
});
