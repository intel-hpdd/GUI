import highland from 'highland';
import {curry} from 'intel-fp';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('Host Cpu Ram chart', () => {
  var chartCompiler, getHostCpuRamStream, selectStoreCount,
    submitHandler, config1$, config2$,
    getHostCpuRamChart, getStore, standardConfig,
    durationPayload, data$Fn, initStream,
    durationSubmitHandler, localApply, mod,
    getConf;

  beforeEachAsync(async function () {
    getHostCpuRamStream = {};

    standardConfig = {
      configType: 'duration',
      size: 10,
      unit: 'minutes',
      startDate: 1464812942650,
      endDate: 1464812997102
    };

    config1$ = highland([{
      'hostCpuRamChart': {...standardConfig}
    }]);
    spyOn(config1$, 'destroy');
    config2$ = highland([{
      'hostCpuRamChart': {...standardConfig}
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

    mod = await mock('source/iml/host-cpu-ram-chart/get-host-cpu-ram-chart.js', {
      'source/iml/host-cpu-ram-chart/get-host-cpu-ram-stream.js': { default: getHostCpuRamStream },
      'source/iml/store/get-store.js': { default: getStore },
      'source/iml/duration-picker/duration-payload.js': { default: durationPayload },
      'source/iml/duration-picker/duration-submit-handler.js': { default: durationSubmitHandler },
      'source/iml/chart-transformers/chart-transformers.js': { getConf: getConf }
    });
  });

  afterEach(resetAll);

  beforeEach(() => {
    chartCompiler = jasmine.createSpy('chartCompiler');

    initStream = highland();
    spyOn(initStream, 'destroy');

    data$Fn = jasmine.createSpy('data$Fn')
      .and.callFake(() => initStream);

    localApply = jasmine.createSpy('localApply');

    getHostCpuRamChart = mod.default(chartCompiler, curry(3, data$Fn), localApply);
  });

  it('should return a factory function', () => {
    expect(getHostCpuRamChart).toEqual(jasmine.any(Function));
  });

  describe('for page hostCpuRamChart', () => {
    beforeEach(() => {
      getHostCpuRamChart(
        'Object Storage Server',
        {
          qs: {
            host_id: '1'
          }
        },
        'hostCpuRamChart'
      );

      var s = chartCompiler.calls.argsFor(0)[1];
      s.each(() => {});
    });

    it('should dispatch hostCpuRamChart to the store', () => {
      expect(getStore.dispatch).toHaveBeenCalledOnceWith({
        type: 'DEFAULT_HOST_CPU_RAM_CHART_ITEMS',
        payload: {
          page: 'hostCpuRamChart',
          configType: 'duration',
          size: 10,
          unit: 'minutes',
          startDate: 1464812942650,
          endDate: 1464812997102
        }
      });
    });

    it('should select the hostCpuRamChart store', () => {
      expect(getStore.select).toHaveBeenCalledOnceWith('hostCpuRamCharts');
    });

    it('should call getConf', () => {
      expect(getConf).toHaveBeenCalledOnceWith('hostCpuRamChart');
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
        '/static/chroma_ui/source/iml/host-cpu-ram-chart/assets/html/host-cpu-ram-chart.js',
        jasmine.any(Object),
        jasmine.any(Function)
      );
    });
  });

  describe('setup', () => {
    var handler, $scope, config;

    beforeEach(inject(($rootScope) => {
      getHostCpuRamChart(
        'Object Storage Server',
        {
          qs: {
            host_id: '1'
          }
        },
        'hostCpuRamChart'
      );

      handler = chartCompiler.calls.mostRecent().args[2];
      $scope = $rootScope.$new();

      config = handler($scope, initStream);
    }));

    it('should return a config', () => {
      expect(config).toEqual({
        title: 'Object Storage Server',
        stream: initStream,
        configType: 'duration',
        page: '',
        startDate: 1464812942650,
        endDate: 1464812997102,
        size: 10,
        unit: 'minutes',
        onSubmit: submitHandler,
        options: {
          setup: jasmine.any(Function)
        }
      });
    });

    it('should select the hostCpuRamChart store', () => {
      expect(getStore.select).toHaveBeenCalledTwiceWith('hostCpuRamCharts');
    });

    it('should call getConf', () => {
      expect(getConf).toHaveBeenCalledTwiceWith('hostCpuRamChart');
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

    describe('chart', () => {
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
          color: jasmine.createSpy('color')
        };

        config.options.setup(chart, d3);
      });

      it('should use interactive guideline', () => {
        expect(chart.useInteractiveGuideline)
          .toHaveBeenCalledOnceWith(true);
      });

      it('should should force y', () => {
        expect(chart.forceY).toHaveBeenCalledOnceWith([0, 1]);
      });

      it('should set y tick format', () => {
        expect(chart.yAxis.tickFormat)
          .toHaveBeenCalledOnceWith(formatter);
      });

      it('should should create a tick formatter', () => {
        expect(d3.format).toHaveBeenCalledOnceWith('.1%');
      });

      it('should set colors', () => {
        expect(chart.color)
          .toHaveBeenCalledOnceWith(['#F3B600', '#0067B4']);
      });
    });
  });

  describe('on submit', () => {
    var handler, $scope, config;

    beforeEach(inject(($rootScope) => {
      getHostCpuRamChart(
        'Object Storage Server',
        {
          qs: {
            host_id: '1'
          }
        },
        'hostCpuRamChart'
      );

      handler = chartCompiler.calls.mostRecent().args[2];
      $scope = $rootScope.$new();

      config = handler($scope, initStream);

      config.onSubmit();
    }));

    it('should call durationSubmitHandler', () => {
      expect(durationSubmitHandler).toHaveBeenCalledOnceWith(
        'UPDATE_HOST_CPU_RAM_CHART_ITEMS',
        {page: 'hostCpuRamChart'}
      );
    });

    it('should invoke the submit handler', () => {
      expect(submitHandler).toHaveBeenCalledOnce();
    });
  });
});
