describe('base chart', function () {
  'use strict';

  var $window, nv, d3;

  beforeEach(window.module('charts', function ($provide) {
    $window = {
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener')
    };

    $provide.value('$window', $window);

    nv = {};
    $provide.value('nv', nv);

    d3 = {
      select: jasmine.createSpy('select')
        .andCallFake(_.identity)
    };

    $provide.value('d3', d3);
  }));

  var baseChart;

  beforeEach(inject(function (_baseChart_) {
    baseChart = _baseChart_;
  }));

  it('should return a factory function', function () {
    expect(baseChart).toEqual(jasmine.any(Function));
  });

  it('should generate a directive definition object', function () {
    expect(baseChart()).toEqual({
      restrict: 'E',
      require: '^?fullScreen',
      replace: true,
      scope: {
        stream: '=',
        options: '='
      },
      templateUrl: 'common/charts/assets/html/chart.html',
      link: jasmine.any(Function)
    });
  });

  describe('linking function', function () {
    var linker, s, generateChart, scope, element, fullScreenCtrl, svg, deregister;

    beforeEach(function () {
      deregister = jasmine.createSpy('deregister');

      s = highland();

      scope = {
        stream: s,
        $watch: jasmine.createSpy('$watch').andReturn(deregister),
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

      svg.attr.andReturn(svg);
      svg.transition.andReturn(svg);
      svg.duration.andReturn(svg);
      svg.call.andReturn(svg);
      svg.remove.andReturn(svg);

      element = {
        querySelector: jasmine.createSpy('querySelector')
          .andReturn(svg),
        getBoundingClientRect: jasmine.createSpy('getBoundingClientRect').andReturn({
          bottom: 703,
          height: 450,
          left: 15,
          right: 1263,
          top: 253,
          width: 1248
        })
      };

      generateChart = jasmine.createSpy('generateChart').andCallFake(_.identity);

      var ddo = baseChart({
        generateChart: generateChart
      });

      fullScreenCtrl = {
        addListener: jasmine.createSpy('addListener'),
        removeListener: jasmine.createSpy('removeListener')
      };

      linker = ddo.link;

      linker(scope, [element], {}, fullScreenCtrl);
    });

    it('should add a listener for the fullscreen controller', function () {
      expect(fullScreenCtrl.addListener).toHaveBeenCalledOnceWith(jasmine.any(Function));
    });

    it('should generate the chart', function () {
      expect(generateChart).toHaveBeenCalledOnceWith(nv);
    });

    it('should set preserveAspectRatio on the svg element', function () {
      expect(svg.attr).toHaveBeenCalledOnceWith('preserveAspectRatio', 'xMinYMid');
    });

    it('should set width on the svg element', function () {
      expect(svg.attr).toHaveBeenCalledOnceWith('width', '100%');
    });

    it('should set height on the svg element', function () {
      expect(svg.attr).toHaveBeenCalledOnceWith('height', '100%');
    });

    it('should add a resize listener', function () {
      expect($window.addEventListener).toHaveBeenCalledOnceWith('resize', jasmine.any(Function));
    });

    it('should set viewBox on the svg element', function () {
      expect(svg.attr).toHaveBeenCalledOnceWith('viewBox', '0 0 1248 450');
    });

    it('should watch the stream object', function () {
      expect(scope.$watch).toHaveBeenCalledOnceWith('stream', jasmine.any(Function));
    });

    it('should register a destroy handler', function () {
      expect(scope.$on).toHaveBeenCalledOnceWith('$destroy', jasmine.any(Function));
    });

    describe('rendering data', function () {
      beforeEach(function () {
        s.write([ {id: '3', ts: '2014-01-07T14:42:50.000Z'} ]);
      });

      it('should pull the last data', function () {
        expect(svg.datum).toHaveBeenCalledTwice();
      });

      it('should set the new data', function () {
        expect(svg.datum)
          .toHaveBeenCalledOnceWith([ { id: '3', ts: '2014-01-07T14:42:50.000Z' } ]);
      });
    });

    describe('destroy handler', function () {
      beforeEach(function () {
        scope.$on.calls[0].args[1]();
      });

      it('should deregister the stream watcher', function () {
        expect(deregister).toHaveBeenCalledOnce();
      });

      it('should remove the resize listener', function () {
        expect($window.removeEventListener)
          .toHaveBeenCalledOnceWith('resize', jasmine.any(Function), false);
      });

      it('should remove the full screen controller listener', function () {
        expect(fullScreenCtrl.removeListener)
          .toHaveBeenCalledOnceWith(jasmine.any(Function));
      });

      it('should remove the svg element', function () {
        expect(svg.remove).toHaveBeenCalledOnce();
      });
    });
  });
});
