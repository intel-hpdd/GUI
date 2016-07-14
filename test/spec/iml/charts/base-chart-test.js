import highland from 'highland';
import {identity} from 'intel-fp';
import chartsModule from '../../../../source/iml/charts/charts-module';

describe('base chart', () => {
  var $window, nv, d3;

  beforeEach(module(chartsModule, $provide => {
    $window = {
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener')
    };

    $provide.value('$window', $window);

    nv = {};
    $provide.value('nv', nv);

    d3 = {
      select: jasmine.createSpy('select')
        .and.callFake(identity)
    };

    $provide.value('d3', d3);
  }));

  var baseChart;

  beforeEach(inject((_baseChart_) => {
    baseChart = _baseChart_;
  }));

  it('should return a factory function', () => {
    expect(baseChart).toEqual(jasmine.any(Function));
  });

  it('should generate a directive definition object', () => {
    expect(baseChart()).toEqual({
      restrict: 'E',
      require: ['^?fullScreen', '^panels'],
      replace: true,
      scope: {
        stream: '=',
        options: '='
      },
      templateUrl: '/static/chroma_ui/source/iml/charts/assets/html/chart.js',
      link: jasmine.any(Function)
    });
  });

  describe('linking function', () => {
    let linker, s, generateChart, scope,
      element, fullScreenCtrl, svg, panels;

    beforeEach(() => {
      s = highland();

      scope = {
        stream: s,
        $on: jasmine.createSpy('$on')
      };

      svg = {
        attr: jasmine.createSpy('attr'),
        transition: jasmine.createSpy('transition'),
        duration: jasmine.createSpy('duration'),
        call: jasmine.createSpy('call'),
        remove: jasmine.createSpy('remove'),
        datum: jasmine.createSpy('datum')
      };

      svg.attr.and.returnValue(svg);
      svg.transition.and.returnValue(svg);
      svg.duration.and.returnValue(svg);
      svg.call.and.returnValue(svg);
      svg.remove.and.returnValue(svg);

      element = {
        querySelector: jasmine.createSpy('querySelector')
          .and.returnValue(svg),
        getBoundingClientRect: jasmine.createSpy('getBoundingClientRect').and.returnValue({
          bottom: 703,
          height: 450,
          left: 15,
          right: 1263,
          top: 253,
          width: 1248
        })
      };

      generateChart = jasmine.createSpy('generateChart')
        .and.callFake(identity);

      var ddo = baseChart({
        generateChart: generateChart
      });

      fullScreenCtrl = {
        addListener: jasmine.createSpy('addListener'),
        removeListener: jasmine.createSpy('removeListener')
      };

      panels = {
        register: jasmine.createSpy('register'),
        deregister: jasmine.createSpy('deregister')
      };

      linker = ddo.link;

      linker(scope, [element], {}, [fullScreenCtrl, panels]);
    });

    it('should add a listener for the fullscreen controller', () => {
      expect(fullScreenCtrl.addListener).toHaveBeenCalledOnceWith(jasmine.any(Function));
    });

    it('should generate the chart', () => {
      expect(generateChart).toHaveBeenCalledOnceWith(nv);
    });

    it('should set width on the svg element', () => {
      expect(svg.attr).toHaveBeenCalledOnceWith('width', '100%');
    });

    it('should set height on the svg element', () => {
      expect(svg.attr).toHaveBeenCalledOnceWith('height', '100%');
    });

    it('should add a resize listener', () => {
      expect($window.addEventListener).toHaveBeenCalledOnceWith('resize', jasmine.any(Function));
    });

    it('should register a panel listener', () => {
      expect(panels.register)
        .toHaveBeenCalledOnceWith(jasmine.any(Function));
    });

    it('should register a destroy handler', () => {
      expect(scope.$on).toHaveBeenCalledOnceWith('$destroy', jasmine.any(Function));
    });

    describe('rendering data', () => {
      beforeEach(() => {
        s.write([ {id: '3', ts: '2014-01-07T14:42:50.000Z'} ]);
      });

      it('should pull the last data', () => {
        expect(svg.datum).toHaveBeenCalledTwice();
      });

      it('should set the new data', () => {
        expect(svg.datum)
          .toHaveBeenCalledOnceWith([ { id: '3', ts: '2014-01-07T14:42:50.000Z' } ]);
      });
    });

    describe('destroy handler', () => {
      beforeEach(() => {
        scope.$on.calls.argsFor(0)[1]();
      });

      it('should remove the resize listener', () => {
        expect($window.removeEventListener)
          .toHaveBeenCalledOnceWith('resize', jasmine.any(Function), false);
      });

      it('should deregister the panel listener', () => {
        expect(panels.deregister)
          .toHaveBeenCalledOnceWith(jasmine.any(Function));
      });

      it('should remove the full screen controller listener', () => {
        expect(fullScreenCtrl.removeListener)
          .toHaveBeenCalledOnceWith(jasmine.any(Function));
      });

      it('should remove the svg element', () => {
        expect(svg.remove).toHaveBeenCalledOnce();
      });
    });
  });
});
