import highland from 'highland';

describe('base chart', () => {
  let mockGlobal, mockNv, mockD3, baseChart;

  beforeEach(() => {

    mockD3 = {
      select: jest.fn(x => x)
    };

    mockGlobal = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };

    mockNv = {};

    jest.mock('../../../../source/iml/global.js', () => mockGlobal);
    jest.mock('d3', () => mockD3);
    jest.mock('nvd3', () => mockNv);

    const mod = require('../../../../source/iml/charts/base-chart.js');

    baseChart = mod.default;
  });

  it('should return a factory function', () => {
    expect(baseChart).toEqual(expect.any(Function));
  });

  it('should generate a directive definition object', () => {
    expect(baseChart()).toEqual({
      restrict: 'E',
      require: ['^?fullScreen', '^rootPanel'],
      replace: true,
      scope: {
        stream: '=',
        options: '='
      },
      template: `<div class="chart">
  <svg></svg>
</div>`,
      link: expect.any(Function)
    });
  });

  describe('linking function', () => {
    let linker,
      s,
      generateChart,
      scope,
      element,
      fullScreenCtrl,
      svg,
      rootPanel;

    beforeEach(() => {
      s = highland();

      scope = {
        stream: s,
        $on: jest.fn()
      };

      svg = {
        attr: jest.fn(() => svg),
        transition: jest.fn(() => svg),
        duration: jest.fn(() => svg),
        call: jest.fn(() => svg),
        remove: jest.fn(() => svg),
        datum: jest.fn()
      };

      svg[0] = {};

      element = {
        querySelector: jest.fn(() => svg),
        getBoundingClientRect: jest.fn(() => ({
          bottom: 703,
          height: 450,
          left: 15,
          right: 1263,
          top: 253,
          width: 1248
        }))
      };

      generateChart = jest.fn(x => x);

      const ddo = baseChart({
        generateChart
      });

      fullScreenCtrl = {
        addListener: jest.fn(),
        removeListener: jest.fn()
      };

      rootPanel = {
        register: jest.fn(),
        deregister: jest.fn()
      };

      linker = ddo.link;

      linker(scope, [element], {}, [fullScreenCtrl, rootPanel]);
    });

    it('should add a listener for the fullscreen controller', () => {
      expect(fullScreenCtrl.addListener).toHaveBeenCalledOnceWith(
        expect.any(Function)
      );
    });

    it('should generate the chart', () => {
      expect(generateChart).toHaveBeenCalledOnceWith(mockNv);
    });

    it('should set width on the svg element', () => {
      expect(svg.attr).toHaveBeenCalledOnceWith('width', '100%');
    });

    it('should set height on the svg element', () => {
      expect(svg.attr).toHaveBeenCalledOnceWith('height', '100%');
    });

    it('should add a resize listener', () => {
      expect(mockGlobal.addEventListener).toHaveBeenCalledOnceWith(
        'resize',
        expect.any(Function)
      );
    });

    it('should register a panel listener', () => {
      expect(rootPanel.register).toHaveBeenCalledOnceWith(expect.any(Function));
    });

    it('should register a destroy handler', () => {
      expect(scope.$on).toHaveBeenCalledOnceWith(
        '$destroy',
        expect.any(Function)
      );
    });

    describe('rendering data', () => {
      beforeEach(() => {
        s.write([{ id: '3', ts: '2014-01-07T14:42:50.000Z' }]);
      });

      it('should pull the last data', () => {
        expect(svg.datum).toHaveBeenCalledTimes(2);
      });

      it('should set the new data', () => {
        expect(svg.datum).toHaveBeenCalledOnceWith([
          { id: '3', ts: '2014-01-07T14:42:50.000Z' }
        ]);
      });
    });

    describe('destroy handler', () => {
      beforeEach(() => {
        scope.$on.mock.calls[0][1]();
      });

      it('should remove the resize listener', () => {
        expect(mockGlobal.removeEventListener).toHaveBeenCalledOnceWith(
          'resize',
          expect.any(Function),
          false
        );
      });

      it('should deregister the panel listener', () => {
        expect(rootPanel.deregister).toHaveBeenCalledOnceWith(
          expect.any(Function)
        );
      });

      it('should remove the full screen controller listener', () => {
        expect(fullScreenCtrl.removeListener).toHaveBeenCalledOnceWith(
          expect.any(Function)
        );
      });

      it('should remove the svg element', () => {
        expect(svg.remove).toHaveBeenCalledTimes(1);
      });
    });
  });
});
