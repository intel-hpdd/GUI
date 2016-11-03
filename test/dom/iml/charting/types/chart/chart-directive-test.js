import highland from 'highland';
import d3 from 'd3';
import angular from 'angular';
import * as fp from 'intel-fp';
import chartModule from
  '../../../../../../source/iml/charting/types/chart/chart-module';

describe('chart directive', () => {
  var chartCtrl, $window;

  beforeEach(module(chartModule, ($provide, $compileProvider) => {
    $compileProvider.directive('tester', () => {
      return {
        require: '^^charter',
        link ($scope, el, attr, ctrl) {
          chartCtrl = ctrl;
        }
      };
    });

    $window = {
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener')
    };
    $provide.value('$window', $window);

    $provide.value('debounce', jasmine.createSpy('debounce')
      .and
      .callFake(fp.identity));
  }));

  let el = 'bar', qs, $scope;

  beforeEach(inject(($rootScope, $compile) => {
    const template  = `
    <div charter stream="stream" on-update="onUpdate">
      <g tester class="tester"></g>
    </div>
    `;

    $scope = $rootScope.$new();
    $scope.stream = highland();
    $scope.onUpdate = [];

    el = angular.element(template)[0];
    document.body.appendChild(el);

    d3.select(el)
      .style({
        display: 'inline-block',
        width: '200px',
        height: '200px'
      });

    $compile(el)($scope);

    qs = (expr) => el.querySelector(expr);

    $scope.$digest();
  }));

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should append a svg element', () => {
    expect(qs('svg')).not.toBeNull();
  });

  it('should append a g element', () => {
    expect(qs('g')).not.toBeNull();
  });

  it('should transclude content', () => {
    expect(qs('.tester')).not.toBeNull();
  });

  it('should set svg width', function () {
    expect(qs('svg').getAttribute('width')).toBe('200');
  });

  it('should set svg height', function () {
    expect(qs('svg').getAttribute('height')).toBe('200');
  });

  it('should translate g to margin', function () {
    expect(qs('g').getAttribute('transform'))
    .toBe('translate(50,30)');
  });

  describe('controller', () => {
    it('should set the margin to some defaults', () => {
      expect(chartCtrl.margin).toEqual({
        top: 30,
        right: 30,
        bottom: 30,
        left: 50
      });
    });

    it('should set svg to a d3 wrapped node', () => {
      expect(qs('svg')).toBe(chartCtrl.svg.node());
    });

    it('should set outer height', () => {
      expect(chartCtrl.getOuterHeight()).toBe(200);
    });

    it('should set outer width', () => {
      expect(chartCtrl.getOuterWidth()).toBe(200);
    });

    it('should set height', () => {
      expect(chartCtrl.getHeight()).toBe(140);
    });

    it('should set width', () => {
      expect(chartCtrl.getWidth()).toBe(120);
    });

    it('should have an update queue', () => {
      expect(chartCtrl.onUpdate).toEqual([]);
    });

    it('should have a dispatcher', function () {
      expect(chartCtrl.dispatch.event).toEqual(jasmine.any(Function));
    });
  });

  describe('on updates', function () {
    var spy;

    beforeEach(() => {
      spy = jasmine.createSpy('spy');
      chartCtrl.onUpdate.push(spy);
      $scope.stream.write(['foo', 'bar']);
    });

    describe('from a stream', function () {
      it('should call listeners', function () {
        expect(spy)
          .toHaveBeenCalledOnceWith({
            svg: jasmine.any(Object),
            width: 120,
            height: 140,
            xs: ['foo', 'bar']
          });
      });

      it('should set data on svg', function () {
        expect(chartCtrl.svg.datum()).toEqual(['foo', 'bar']);
      });
    });

    describe('from a resize', () => {
      it('should call listeners', () => {
        $window.addEventListener.calls.argsFor(0)[1]();

        expect(spy)
          .toHaveBeenCalledTwiceWith({
            svg: jasmine.any(Object),
            width: 120,
            height: 140,
            xs: ['foo', 'bar']
          });
      });
    });
  });

  it('should remove the listener on destroy', () => {
    $scope.$destroy();

    expect($window.removeEventListener)
      .toHaveBeenCalledOnceWith('resize', jasmine.any(Function));
  });
});
