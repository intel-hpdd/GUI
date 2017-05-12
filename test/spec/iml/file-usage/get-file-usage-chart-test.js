import highland from 'highland';
import * as fp from '@mfl/fp';

import { mock, resetAll } from '../../../system-mock.js';

describe('file usage chart', () => {
  let chartCompiler,
    getFileUsageStream,
    fileUsageStream,
    standardConfig,
    getFileUsageChart,
    getFileUsageChartFactory,
    config1$,
    config2$,
    selectStoreCount,
    getStore,
    durationPayload,
    submitHandler,
    durationSubmitHandler,
    getConf,
    initStream,
    data$Fn,
    localApply;

  beforeEachAsync(async function() {
    fileUsageStream = {};
    getFileUsageStream = jasmine
      .createSpy('getFileUsageStream')
      .and.returnValue(fileUsageStream);

    standardConfig = {
      configType: 'duration',
      size: 10,
      unit: 'minutes',
      startDate: 1464812942650,
      endDate: 1464812997102
    };

    config1$ = highland([
      {
        target1: { ...standardConfig }
      }
    ]);
    spyOn(config1$, 'destroy');
    config2$ = highland([
      {
        target1: standardConfig
      }
    ]);
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

    durationPayload = jasmine.createSpy('durationPayload').and.callFake(x => {
      return { ...standardConfig, ...x };
    });

    submitHandler = jasmine.createSpy('submitHandler');
    durationSubmitHandler = jasmine
      .createSpy('durationSubmitHandler')
      .and.returnValue(submitHandler);

    getConf = jasmine.createSpy('getConf').and.callFake(page => {
      return s => {
        return s.map(x => {
          return x[page];
        });
      };
    });

    initStream = highland();
    spyOn(initStream, 'destroy');

    data$Fn = jasmine.createSpy('data$Fn').and.callFake((overrides, fn) => {
      fn();
      return initStream;
    });

    localApply = jasmine.createSpy('localApply');

    chartCompiler = jasmine.createSpy('chartCompiler');

    const mod = await mock('source/iml/file-usage/get-file-usage-chart.js', {
      'source/iml/file-usage/get-file-usage-stream.js': {
        default: getFileUsageStream
      },
      'source/iml/file-usage/assets/html/file-usage-chart.html': {
        default: 'fileUsageTemplate'
      },
      'source/iml/chart-compiler/chart-compiler.js': { default: chartCompiler },
      'source/iml/store/get-store.js': { default: getStore },
      'source/iml/duration-picker/duration-payload.js': {
        default: durationPayload
      },
      'source/iml/duration-picker/duration-submit-handler.js': {
        default: durationSubmitHandler
      },
      'source/iml/chart-transformers/chart-transformers.js': {
        getConf: getConf
      }
    });

    getFileUsageChartFactory = mod.default;
  });

  afterEach(resetAll);

  beforeEach(() => {
    getFileUsageChart = getFileUsageChartFactory(
      localApply,
      fp.curry3(data$Fn)
    );

    getFileUsageChart(
      'foo',
      'bar',
      {
        qs: {
          host_id: '1'
        }
      },
      'target1'
    );

    const s = chartCompiler.calls.argsFor(0)[1];
    s.each(() => {});
  });

  it('should return a factory function', () => {
    expect(getFileUsageChart).toEqual(jasmine.any(Function));
  });

  it('should dispatch fileUsageChart to the store', () => {
    expect(getStore.dispatch).toHaveBeenCalledOnceWith({
      type: 'DEFAULT_FILE_USAGE_CHART_ITEMS',
      payload: {
        page: 'target1',
        configType: 'duration',
        size: 10,
        unit: 'minutes',
        startDate: 1464812942650,
        endDate: 1464812997102
      }
    });
  });

  it('should select the fileUsageChart store', () => {
    expect(getStore.select).toHaveBeenCalledOnceWith('fileUsageCharts');
  });

  it('should call getConf', () => {
    expect(getConf).toHaveBeenCalledOnceWith('target1');
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
      'fileUsageTemplate',
      jasmine.any(Object),
      jasmine.any(Function)
    );
  });

  it('should call getFileUsageStream with the key', function() {
    expect(getFileUsageStream).toHaveBeenCalledWith('bar');
  });

  describe('config', () => {
    let handler, $scope, stream, config;

    beforeEach(
      inject($rootScope => {
        handler = chartCompiler.calls.mostRecent().args[2];

        stream = highland();
        spyOn(stream, 'destroy');
        $scope = $rootScope.$new();

        config = handler($scope, stream);
      })
    );

    it('should return a config', () => {
      expect(config).toEqual({
        title: 'foo',
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

    it('should select the fileUsageChart store', () => {
      expect(getStore.select).toHaveBeenCalledTwiceWith('fileUsageCharts');
    });

    it('should call getConf', () => {
      expect(getConf).toHaveBeenCalledTwiceWith('target1');
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
      let chart, formatter;

      beforeEach(() => {
        formatter = {};

        const d3 = {
          format: jasmine.createSpy('format').and.returnValue(formatter)
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
          color: jasmine.createSpy('color'),
          isArea: jasmine.createSpy('isArea')
        };

        config.options.setup(chart, d3);
      });

      it('should use interactive guideline', () => {
        expect(chart.useInteractiveGuideline).toHaveBeenCalledOnceWith(true);
      });

      it('should forceY', () => {
        expect(chart.forceY).toHaveBeenCalledOnceWith([0, 1]);
      });

      it('should set y tick format', () => {
        expect(chart.yAxis.tickFormat).toHaveBeenCalledOnceWith(formatter);
      });

      it('should not show max and min on the x axis', () => {
        expect(chart.xAxis.showMaxMin).toHaveBeenCalledOnceWith(false);
      });

      it('should set a color', () => {
        expect(chart.color).toHaveBeenCalledOnceWith(['#f05b59']);
      });

      it('should set the chart to area', () => {
        expect(chart.isArea).toHaveBeenCalledOnceWith(true);
      });
    });
  });

  describe('on submit', () => {
    let handler, $scope, config;

    beforeEach(
      inject($rootScope => {
        handler = chartCompiler.calls.mostRecent().args[2];
        $scope = $rootScope.$new();

        config = handler($scope, initStream);

        config.onSubmit();
      })
    );

    it('should call durationSubmitHandler', () => {
      expect(
        durationSubmitHandler
      ).toHaveBeenCalledOnceWith('UPDATE_FILE_USAGE_CHART_ITEMS', {
        page: 'target1'
      });
    });

    it('should invoke the submit handler', () => {
      expect(submitHandler).toHaveBeenCalledTimes(1);
    });
  });
});
