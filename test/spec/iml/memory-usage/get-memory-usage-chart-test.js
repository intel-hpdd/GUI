import highland from 'highland';
import * as fp from 'intel-fp';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('memory usage chart', () => {
  var chartCompiler, getMemoryUsageStream, standardConfig,
    getMemoryUsageChartFactory, config1$, config2$,
    getMemoryUsageChart, selectStoreCount, getStore,
    durationPayload, submitHandler, getConf, initStream,
    durationSubmitHandler, data$Fn, localApply;

  beforeEachAsync(async function () {
    getMemoryUsageStream = {};

    getMemoryUsageStream = jasmine.createSpy('getFileUsageStream');

    standardConfig = {
      configType: 'duration',
      size: 10,
      unit: 'minutes',
      startDate: 1464812942650,
      endDate: 1464812997102
    };

    config1$ = highland([{
      'server1': {...standardConfig}
    }]);
    spyOn(config1$, 'destroy');
    config2$ = highland([{
      'server1': standardConfig
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

    durationPayload = jasmine.createSpy('durationPayload')
      .and.callFake(x => {
        return {...standardConfig, ...x};
      });

    submitHandler = jasmine.createSpy('submitHandler');
    durationSubmitHandler = jasmine.createSpy('durationSubmitHandler')
      .and.returnValue(submitHandler);

    getConf = jasmine.createSpy('getConf')
      .and.callFake(page => {
        return s => {
          return s.map(x => {
            return x[page];
          });
        };
      });

    initStream = highland();
    spyOn(initStream, 'destroy');

    data$Fn = jasmine.createSpy('data$Fn')
      .and.callFake((overrides, fn) => {
        fn()();
        return initStream;
      });

    localApply = jasmine.createSpy('localApply');

    chartCompiler = jasmine.createSpy('chartCompiler');

    const mod = await mock('source/iml/memory-usage/get-memory-usage-chart.js', {
      'source/iml/memory-usage/get-memory-usage-stream.js': { default: getMemoryUsageStream },
      'source/iml/memory-usage/assets/html/memory-usage-chart.html!text': { default: 'memoryUsageTemplate' },
      'source/iml/chart-compiler/chart-compiler.js': { default: chartCompiler },
      'source/iml/store/get-store.js': { default: getStore },
      'source/iml/duration-picker/duration-payload.js': { default: durationPayload },
      'source/iml/duration-picker/duration-submit-handler.js': { default: durationSubmitHandler },
      'source/iml/chart-transformers/chart-transformers.js': { getConf: getConf }
    });
    getMemoryUsageChartFactory = mod.default;
  });

  afterEach(resetAll);

  beforeEach(() => {
    getMemoryUsageChart = getMemoryUsageChartFactory(
      localApply, fp.curry3(data$Fn)
    );

    getMemoryUsageChart({
      qs: {
        host_id: '1'
      }
    }, 'server1');

    var s = chartCompiler.calls.argsFor(0)[1];
    s.each(() => {});
  });

  it('should return a factory function', () => {
    expect(getMemoryUsageChart).toEqual(jasmine.any(Function));
  });

  it('should dispatch fileUsageChart to the store', () => {
    expect(getStore.dispatch).toHaveBeenCalledOnceWith({
      type: 'DEFAULT_MEMORY_USAGE_CHART_ITEMS',
      payload: {
        page: 'server1',
        configType: 'duration',
        size: 10,
        unit: 'minutes',
        startDate: 1464812942650,
        endDate: 1464812997102
      }
    });
  });

  it('should select the fileUsageChart store', () => {
    expect(getStore.select).toHaveBeenCalledOnceWith('memoryUsageCharts');
  });

  it('should call getConf', () => {
    expect(getConf).toHaveBeenCalledOnceWith('server1');
  });

  it('should call data$Fn', () => {
    expect(data$Fn).toHaveBeenCalledOnceWith(
      {
        qs: {
          host_id: '1'
        }
      },
      jasmine.any(Function),
      standardConfig
    );
  });

  it('should call the chart compiler', () => {
    expect(chartCompiler).toHaveBeenCalledOnceWith(
      'memoryUsageTemplate',
      jasmine.any(Object),
      jasmine.any(Function)
    );
  });

  it('should call getMemoryUsageStream with the key', function () {
    expect(getMemoryUsageStream).toHaveBeenCalledOnce();
  });

  describe('config', () => {
    var handler, $scope, stream,
      config;

    beforeEach(inject(($rootScope) => {
      handler = chartCompiler.calls.mostRecent().args[2];

      stream = highland();
      spyOn(stream, 'destroy');
      $scope = $rootScope.$new();

      config = handler($scope, stream);
    }));

    it('should return a config', () => {
      expect(config).toEqual({
        stream: jasmine.any(Object),
        configType: 'duration',
        page: '',
        startDate: 1464812942650,
        endDate: 1464812997102,
        size: 10,
        unit: 'minutes',
        onSubmit: jasmine.any(Function),
        options: {
          setup: jasmine.any(Function)
        }
      });
    });

    it('should select the memoryUsageChart store', () => {
      expect(getStore.select).toHaveBeenCalledTwiceWith('memoryUsageCharts');
    });

    it('should call getConf', () => {
      expect(getConf).toHaveBeenCalledTwiceWith('server1');
    });

    it('should call localApply', () => {
      expect(localApply).toHaveBeenCalledOnceWith($scope);
    });

    it('should destroy the stream when the chart is destroyed', () => {
      $scope.$destroy();

      expect(initStream.destroy).toHaveBeenCalled();
      expect(config1$.destroy).toHaveBeenCalled();
      expect(config2$.destroy).toHaveBeenCalled();
    });

    describe('setup', () => {
      var d3Chart;

      beforeEach(() => {
        d3Chart = {
          useInteractiveGuideline: jasmine.createSpy('useInteractiveGuideline'),
          yAxis: {
            tickFormat: jasmine.createSpy('tickFormat')
          },
          xAxis: {
            showMaxMin: jasmine.createSpy('showMaxMin')
          }
        };

        config.options.setup(d3Chart);
      });

      it('should use interactive guideline', () => {
        expect(d3Chart.useInteractiveGuideline)
          .toHaveBeenCalledOnceWith(true);
      });

      it('should set y tick format', () => {
        expect(d3Chart.yAxis.tickFormat)
          .toHaveBeenCalledOnceWith(jasmine.any(Function));
      });

      it('should not show max and min on the x axis', () => {
        expect(d3Chart.xAxis.showMaxMin).toHaveBeenCalledOnceWith(false);
      });
    });
  });

  describe('on submit', () => {
    var handler, $scope, config;

    beforeEach(inject(($rootScope) => {
      handler = chartCompiler.calls.mostRecent().args[2];
      $scope = $rootScope.$new();

      config = handler($scope, initStream);

      config.onSubmit();
    }));

    it('should call durationSubmitHandler', () => {
      expect(durationSubmitHandler).toHaveBeenCalledOnceWith('UPDATE_MEMORY_USAGE_CHART_ITEMS', {page: 'server1'});
    });

    it('should invoke the submit handler', () => {
      expect(submitHandler).toHaveBeenCalledOnce();
    });
  });
});
