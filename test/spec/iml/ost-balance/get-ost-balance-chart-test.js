import highland from 'highland';

import {__, invoke} from 'intel-fp';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('get ost balance chart', () => {
  var getOstBalanceStream, getOstBalanceChartFactory,
    chartCompiler, streamWhenVisible, config1$, config2$,
    getOstBalanceChart, localApply, getStore, standardConfig,
    selectStoreCount, getConf;

  beforeEachAsync(async function () {
    getOstBalanceStream = jasmine.createSpy('getOstBalanceStream')
      .and.callFake(() => highland());

    standardConfig = {
      percentage: 0
    };

    config1$ = highland([{
      'ostBalanceChart': {...standardConfig}
    }]);
    spyOn(config1$, 'destroy');
    config2$ = highland([{
      'ostBalanceChart': standardConfig
    }]);
    spyOn(config2$, 'destroy');
    selectStoreCount = 0;

    getStore = {
      dispatch: jasmine.createSpy('dispatch'),
      select: jasmine.createSpy('select').and.callFake(() => {
        switch (selectStoreCount) {
        case 0:
          selectStoreCount++;
          return config1$;
        default:
          return config2$;
        }
      })
    };

    getConf = jasmine.createSpy('getConf')
      .and.callFake(page => {
        return s => {
          return s.map(x => {
            return x[page];
          });
        };
      });

    const mod = await mock('source/iml/ost-balance/get-ost-balance-chart.js', {
      'source/iml/ost-balance/get-ost-balance-stream.js': { default: getOstBalanceStream },
      'source/iml/store/get-store.js': { default: getStore },
      'source/iml/chart-transformers/chart-transformers.js': { getConf }
    });
    getOstBalanceChartFactory = mod.default;
  });

  afterEach(resetAll);

  beforeEach(() => {
    streamWhenVisible = jasmine.createSpy('streamWhenVisible')
      .and.callFake(invoke(__, []));

    chartCompiler = jasmine.createSpy('chartCompiler');

    localApply = jasmine.createSpy('localApply');

    getOstBalanceChart = getOstBalanceChartFactory(chartCompiler,
      streamWhenVisible, localApply);

    getOstBalanceChart({
      qs: {
        filesystem_id: '1'
      }
    }, 'ostBalanceChart');

    var s = chartCompiler.calls.argsFor(0)[1];
    s.each(() => {});
  });

  it('should return a factory function', () => {
    expect(getOstBalanceChart)
      .toEqual(jasmine.any(Function));
  });

  it('should dispatch to the store', () => {
    expect(getStore.dispatch).toHaveBeenCalledOnceWith({
      type: 'DEFAULT_OST_BALANCE_CHART_ITEMS',
      payload: {
        percentage: 0,
        page: 'ostBalanceChart'
      }
    });
  });

  it('should call getConf with the page', () => {
    expect(getConf).toHaveBeenCalledOnceWith('ostBalanceChart');
  });

  it('should call streamWhenVisible', function () {
    expect(streamWhenVisible)
      .toHaveBeenCalledOnceWith(jasmine.any(Function));
  });

  it('should setup the OstBalanceChart', () => {
    expect(chartCompiler)
      .toHaveBeenCalledOnceWith(
        '/static/chroma_ui/source/iml/ost-balance/assets/html/ost-balance.js',
        jasmine.any(Object),
        jasmine.any(Function)
      );
  });

  it('should create a new stream', function () {
    expect(getOstBalanceStream)
      .toHaveBeenCalledOnceWith(0, {
        qs: {
          filesystem_id: '1'
        }
      });
  });

  describe('conf setup', () => {
    var fn, s, $scope, conf;

    beforeEach(inject(($rootScope) => {
      fn = chartCompiler.calls.argsFor(0)[2];

      s = highland();
      spyOn(s, 'destroy');

      $scope = $rootScope.$new();

      conf = fn($scope, s);
    }));

    it('should setup the conf', function () {
      expect(conf).toEqual({
        percentage: 0,
        page: '',
        stream: s,
        onSubmit: jasmine.any(Function),
        options: {
          setup: jasmine.any(Function)
        }
      });
    });

    it('should destroy the existing stream', function () {
      $scope.$destroy();

      expect(s.destroy).toHaveBeenCalledOnce();
      expect(config1$.destroy).toHaveBeenCalledOnce();
      expect(config2$.destroy).toHaveBeenCalledOnce();
    });

    describe('on submit', () => {
      beforeEach(() => {
        conf.onSubmit({
          percentage: {
            $modelValue: 10
          }
        });
      });

      it('should dispatch to the store', () => {
        expect(getStore.dispatch).toHaveBeenCalledOnceWith({
          type: 'UPDATE_OST_BALANCE_CHART_ITEMS',
          payload: {
            percentage: 10,
            page: 'ostBalanceChart'
          }
        });
      });
    });

    describe('setup', () => {
      var d3Chart, d3, formatter;

      beforeEach(() => {
        d3Chart = {
          forceY: jasmine.createSpy('forceY'),
          stacked: jasmine.createSpy('stacked'),
          yAxis: {
            tickFormat: jasmine.createSpy('tickFormat')
          },
          showXAxis: jasmine.createSpy('showXAxis'),
          tooltip: {
            contentGenerator: jasmine.createSpy('contentGenerator')
          }
        };

        formatter = {};

        d3 = {
          format: jasmine.createSpy('format').and.returnValue(formatter)
        };

        conf.options.setup(d3Chart, d3);
      });

      it('should force Y', () => {
        expect(d3Chart.forceY).toHaveBeenCalledOnceWith([0, 1]);
      });

      it('should set to stacked', () => {
        expect(d3Chart.stacked).toHaveBeenCalledOnceWith(true);
      });

      it('should set tick format on the Y axis', () => {
        expect(d3Chart.yAxis.tickFormat).toHaveBeenCalledOnceWith(formatter);
      });

      it('should generate tooltip content', () => {
        expect(d3Chart.tooltip.contentGenerator)
          .toHaveBeenCalledOnceWith(jasmine.any(Function));
      });
    });
  });
});
