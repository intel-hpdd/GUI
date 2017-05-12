import highland from 'highland';
import * as fp from '@mfl/fp';

import { mock, resetAll } from '../../../system-mock.js';

describe('Read Write Bandwidth chart', () => {
  let chartCompiler,
    getReadWriteBandwidthStream,
    selectStoreCount,
    submitHandler,
    config1$,
    config2$,
    getReadWriteBandwidthChart,
    getStore,
    standardConfig,
    durationPayload,
    data$Fn,
    initStream,
    durationSubmitHandler,
    localApply,
    mod,
    getConf;

  beforeEachAsync(async function() {
    getReadWriteBandwidthStream = {};

    standardConfig = {
      configType: 'duration',
      size: 10,
      unit: 'minutes',
      startDate: 1464812942650,
      endDate: 1464812997102
    };

    config1$ = highland([
      {
        readWriteBandwidthChart: { ...standardConfig }
      }
    ]);
    spyOn(config1$, 'destroy');
    config2$ = highland([
      {
        readWriteBandwidthChart: { ...standardConfig }
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

    chartCompiler = jasmine.createSpy('chartCompiler');

    mod = await mock(
      'source/iml/read-write-bandwidth/get-read-write-bandwidth-chart.js',
      {
        'source/iml/read-write-bandwidth/get-read-write-bandwidth-stream.js': {
          default: getReadWriteBandwidthStream
        },
        'source/iml/read-write-bandwidth/assets/html/read-write-bandwidth.html': {
          default: 'rwBandwidthTemplate'
        },
        'source/iml/chart-compiler/chart-compiler.js': {
          default: chartCompiler
        },
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
      }
    );
  });

  afterEach(resetAll);

  beforeEach(() => {
    initStream = highland();
    spyOn(initStream, 'destroy');

    data$Fn = jasmine.createSpy('data$Fn').and.callFake(() => initStream);

    localApply = jasmine.createSpy('localApply');

    getReadWriteBandwidthChart = mod.default(fp.curry3(data$Fn), localApply);
  });

  it('should return a factory function', () => {
    expect(getReadWriteBandwidthChart).toEqual(jasmine.any(Function));
  });

  describe('for page readWriteBandwidthChart', () => {
    beforeEach(() => {
      getReadWriteBandwidthChart(
        {
          qs: {
            host_id: '1'
          }
        },
        'readWriteBandwidthChart'
      );

      const s = chartCompiler.calls.argsFor(0)[1];
      s.each(() => {});
    });

    it('should dispatch readWriteBandwidthChart to the store', () => {
      expect(getStore.dispatch).toHaveBeenCalledOnceWith({
        type: 'DEFAULT_READ_WRITE_BANDWIDTH_CHART_ITEMS',
        payload: {
          page: 'readWriteBandwidthChart',
          configType: 'duration',
          size: 10,
          unit: 'minutes',
          startDate: 1464812942650,
          endDate: 1464812997102
        }
      });
    });

    it('should select the readWriteBandwidthChart store', () => {
      expect(getStore.select).toHaveBeenCalledOnceWith(
        'readWriteBandwidthCharts'
      );
    });

    it('should call getConf', () => {
      expect(getConf).toHaveBeenCalledOnceWith('readWriteBandwidthChart');
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
        'rwBandwidthTemplate',
        jasmine.any(Object),
        jasmine.any(Function)
      );
    });
  });

  describe('setup', () => {
    let handler, $scope, config;

    beforeEach(
      inject($rootScope => {
        getReadWriteBandwidthChart(
          {
            qs: {
              host_id: '1'
            }
          },
          'readWriteBandwidthChart'
        );

        handler = chartCompiler.calls.mostRecent().args[2];
        $scope = $rootScope.$new();

        config = handler($scope, initStream);
      })
    );

    it('should return a config', () => {
      expect(config).toEqual({
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

    it('should select the readWriteBandwidthChart store', () => {
      expect(getStore.select).toHaveBeenCalledTwiceWith(
        'readWriteBandwidthCharts'
      );
    });

    it('should call getConf', () => {
      expect(getConf).toHaveBeenCalledTwiceWith('readWriteBandwidthChart');
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
      let chart;

      beforeEach(() => {
        chart = {
          useInteractiveGuideline: jasmine.createSpy('useInteractiveGuideline'),
          xAxis: {
            showMaxMin: jasmine.createSpy('showMaxMin')
          },
          yAxis: {
            tickFormat: jasmine.createSpy('tickFormat')
          },
          color: jasmine.createSpy('color'),
          isArea: jasmine.createSpy('isArea')
        };

        config.options.setup(chart);
      });

      it('should use interactive guideline', () => {
        expect(chart.useInteractiveGuideline).toHaveBeenCalledOnceWith(true);
      });

      it('should set y tick format', () => {
        expect(chart.yAxis.tickFormat).toHaveBeenCalledOnceWith(
          jasmine.any(Function)
        );
      });

      it('should set colors', () => {
        expect(chart.color).toHaveBeenCalledOnceWith(['#0067B4', '#E17200']);
      });

      it('should use the area style', () => {
        expect(chart.isArea).toHaveBeenCalledOnceWith(true);
      });

      it('should not show max or min on the x axis', () => {
        expect(chart.xAxis.showMaxMin).toHaveBeenCalledOnceWith(false);
      });
    });
  });

  describe('on submit', () => {
    let handler, $scope, config;

    beforeEach(
      inject($rootScope => {
        getReadWriteBandwidthChart(
          {
            qs: {
              host_id: '1'
            }
          },
          'readWriteBandwidthChart'
        );

        handler = chartCompiler.calls.mostRecent().args[2];
        $scope = $rootScope.$new();

        config = handler($scope, initStream);

        config.onSubmit();
      })
    );

    it('should call durationSubmitHandler', () => {
      expect(
        durationSubmitHandler
      ).toHaveBeenCalledOnceWith('UPDATE_READ_WRITE_BANDWIDTH_CHART_ITEMS', {
        page: 'readWriteBandwidthChart'
      });
    });

    it('should invoke the submit handler', () => {
      expect(submitHandler).toHaveBeenCalledTimes(1);
    });
  });
});
