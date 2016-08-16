import angular from 'angular';
const {inject} = angular.mock;
import highland from 'highland';

import {
  curry
} from 'intel-fp';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('cpu usage chart', () => {
  let chartCompiler, getCpuUsageStream, standardConfig,
    config1$, config2$, selectStoreCount, getStore, durationPayload,
    submitHandler, durationSubmitHandler, getConf, initStream,
    data$Fn, localApply, getCpuUsageChart, getCpuUsageChartFactory;

  beforeEachAsync(async function () {
    getCpuUsageStream = jasmine.createSpy('getFileUsageStream');

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

    const mod = await mock('source/iml/cpu-usage/get-cpu-usage-chart.js', {
      'source/iml/cpu-usage/get-cpu-usage-stream.js': { default: getCpuUsageStream },
      'source/iml/store/get-store.js': { default: getStore },
      'source/iml/duration-picker/duration-payload.js': { default: durationPayload },
      'source/iml/duration-picker/duration-submit-handler.js': { default: durationSubmitHandler },
      'source/iml/chart-transformers/chart-transformers.js': { getConf: getConf },
      'source/iml/chart-compiler/chart-compiler.js': { default: chartCompiler },
      'source/iml/cpu-usage/assets/html/cpu-usage.html!text': { default: 'cpuUsage' }
    });

    getCpuUsageChartFactory = mod.default;
  });

  afterEach(resetAll);

  beforeEach(() => {
    getCpuUsageChart = getCpuUsageChartFactory(localApply, curry(3, data$Fn));

    getCpuUsageChart({
      qs: {
        host_id: '1'
      }
    }, 'server1');

    var s = chartCompiler.calls.argsFor(0)[1];
    s.each(() => {});
  });

  it('should return a factory function', () => {
    expect(getCpuUsageChart).toEqual(jasmine.any(Function));
  });

  it('should dispatch fileUsageChart to the store', () => {
    expect(getStore.dispatch).toHaveBeenCalledOnceWith({
      type: 'DEFAULT_CPU_USAGE_CHART_ITEMS',
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

  it('should select the cpuUsageChart store', () => {
    expect(getStore.select).toHaveBeenCalledOnceWith('cpuUsageCharts');
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
      'cpuUsage',
      jasmine.any(Object),
      jasmine.any(Function)
    );
  });

  it('should call getCpuUsageStream', () => {
    expect(getCpuUsageStream).toHaveBeenCalledOnce();
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
        stream,
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

    it('should select the cpuUsageChart store', () => {
      expect(getStore.select).toHaveBeenCalledTwiceWith('cpuUsageCharts');
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
      var chart, d3, formatter;

      beforeEach(() => {
        formatter = {};

        d3 = {
          format: jasmine.createSpy('format')
            .and.returnValue(formatter)
        };

        chart = {
          useInteractiveGuideline: jasmine.createSpy('useInteractiveGuideline'),
          forceY: jasmine.createSpy('forceY'),
          yAxis: {
            tickFormat: jasmine.createSpy('tickFormat')
          },
          xAxis: {
            showMaxMin: jasmine.createSpy('showMaxMin')
          },
          color: jasmine.createSpy('color')
        };

        config.options.setup(chart, d3);
      });

      it('should use interactive guideline', () => {
        expect(chart.useInteractiveGuideline)
          .toHaveBeenCalledOnceWith(true);
      });

      it('should force y', () => {
        expect(chart.forceY).toHaveBeenCalledOnceWith([0, 1]);
      });

      it('should set y tick format', () => {
        expect(chart.yAxis.tickFormat)
          .toHaveBeenCalledOnceWith(formatter);
      });

      it('should turn off x axis max and min', () => {
        expect(chart.xAxis.showMaxMin)
          .toHaveBeenCalledOnceWith(false);
      });

      it('should should create a tick formatter', () => {
        expect(d3.format).toHaveBeenCalledOnceWith('.1%');
      });

      it('should set colors', () => {
        expect(chart.color)
          .toHaveBeenCalledOnceWith(['#2f7087', '#f09659', '#f0d359']);
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
      expect(durationSubmitHandler).toHaveBeenCalledOnceWith('UPDATE_CPU_USAGE_CHART_ITEMS', {page: 'server1'});
    });

    it('should invoke the submit handler', () => {
      expect(submitHandler).toHaveBeenCalledOnce();
    });
  });
});
