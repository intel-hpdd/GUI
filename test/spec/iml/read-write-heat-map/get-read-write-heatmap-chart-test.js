import highland from 'highland';

import { values } from 'intel-obj';

import { mock, resetAll } from '../../../system-mock.js';

describe('Read Write Heat Map chart', () => {
  let chartCompiler,
    getReadWriteHeatMapStream,
    selectStoreCount,
    submitHandler,
    config1$,
    config2$,
    getReadWriteHeatMapChart,
    getStore,
    standardConfig,
    durationPayload,
    initStream,
    durationSubmitHandler,
    localApply,
    mod,
    getConf,
    streamWhenVisible,
    $state;

  const readWriteHeatMapTypes = {
    READ_BYTES: 'stats_read_bytes',
    WRITE_BYTES: 'stats_write_bytes',
    READ_IOPS: 'stats_read_iops',
    WRITE_IOPS: 'stats_write_iops'
  };

  beforeEachAsync(async function() {
    getReadWriteHeatMapStream = jasmine.createSpy('getReadWriteHeatMapStream');

    standardConfig = {
      configType: 'duration',
      dataType: 'stats_read_bytes',
      size: 10,
      unit: 'minutes',
      startDate: 1464812942650,
      endDate: 1464812997102
    };

    config1$ = highland([
      {
        readWriteHeatMapChart: { ...standardConfig }
      }
    ]);
    spyOn(config1$, 'destroy');
    config2$ = highland([
      {
        readWriteHeatMapChart: standardConfig
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

    streamWhenVisible = jasmine
      .createSpy('streamWhenVisible')
      .and.callFake(fn => fn().consume().each(() => {}));

    chartCompiler = jasmine.createSpy('chartCompiler');

    mod = await mock(
      'source/iml/read-write-heat-map/get-read-write-heat-map-chart.js',
      {
        'source/iml/read-write-heat-map/get-read-write-heat-map-stream.js': {
          default: getReadWriteHeatMapStream
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
        },
        'source/iml/chart-compiler/chart-compiler.js': {
          default: chartCompiler
        },
        'source/iml/read-write-heat-map/assets/html/read-write-heat-map.html!text': {
          default: 'heatMapTemplate'
        },
        'source/iml/environment.js': {
          SERVER_TIME_DIFF: 270
        }
      }
    );
  });

  afterEach(resetAll);

  beforeEach(() => {
    initStream = highland();

    getReadWriteHeatMapStream.and.returnValue(initStream);

    spyOn(initStream, 'destroy');

    localApply = jasmine.createSpy('localApply');

    $state = {
      go: jasmine.createSpy('go')
    };

    getReadWriteHeatMapChart = mod.default(
      $state,
      localApply,
      readWriteHeatMapTypes,
      streamWhenVisible
    );
  });

  it('should return a factory function', () => {
    expect(getReadWriteHeatMapChart).toEqual(jasmine.any(Function));
  });

  describe('for page readWriteHeatMapChart', () => {
    beforeEach(() => {
      getReadWriteHeatMapChart(
        {
          qs: {
            host_id: '1'
          }
        },
        'readWriteHeatMapChart'
      );

      const s = chartCompiler.calls.argsFor(0)[1];
      s.each(() => {});
    });

    it('should dispatch readWriteHeatMapChart to the store', () => {
      expect(getStore.dispatch).toHaveBeenCalledOnceWith({
        type: 'DEFAULT_READ_WRITE_HEAT_MAP_CHART_ITEMS',
        payload: {
          page: 'readWriteHeatMapChart',
          dataType: 'stats_read_bytes',
          configType: 'duration',
          size: 10,
          unit: 'minutes',
          startDate: 1464812942650,
          endDate: 1464812997102
        }
      });
    });

    it('should select the readWriteHeatMap store', () => {
      expect(getStore.select).toHaveBeenCalledOnceWith(
        'readWriteHeatMapCharts'
      );
    });

    it('should call getConf', () => {
      expect(getConf).toHaveBeenCalledOnceWith('readWriteHeatMapChart');
    });

    it('should call getReadWriteHeatMapStream with the dataType', () => {
      expect(getReadWriteHeatMapStream).toHaveBeenCalledOnceWith(
        { qs: { host_id: '1', metrics: 'stats_read_bytes' } },
        {
          configType: 'duration',
          dataType: 'stats_read_bytes',
          startDate: 1464812942650,
          endDate: 1464812997102,
          size: 10,
          unit: 'minutes'
        },
        undefined,
        270
      );
    });

    it('should call the chart compiler', () => {
      expect(chartCompiler).toHaveBeenCalledOnceWith(
        'heatMapTemplate',
        jasmine.any(Object),
        jasmine.any(Function)
      );
    });
  });

  describe('setup', () => {
    let handler, $scope, config;

    beforeEach(
      inject($rootScope => {
        getReadWriteHeatMapChart(
          {
            qs: {
              host_id: '1'
            }
          },
          'readWriteHeatMapChart'
        );

        handler = chartCompiler.calls.mostRecent().args[2];
        $scope = $rootScope.$new();

        config = handler($scope, initStream);
      })
    );

    it('should return a config', () => {
      expect(config).toEqual({
        stream: initStream,
        TYPES: [
          'stats_read_bytes',
          'stats_write_bytes',
          'stats_read_iops',
          'stats_write_iops'
        ],
        configType: 'duration',
        page: '',
        dataType: 'stats_read_bytes',
        toReadableType: jasmine.any(Function),
        startDate: 1464812942650,
        endDate: 1464812997102,
        size: 10,
        unit: 'minutes',
        onSubmit: submitHandler,
        options: {
          setup: jasmine.any(Function),
          beforeUpdate: jasmine.any(Function)
        }
      });
    });

    it('should select the readWriteHeatMapChart store', () => {
      expect(getStore.select).toHaveBeenCalledTwiceWith(
        'readWriteHeatMapCharts'
      );
    });

    it('should call getConf', () => {
      expect(getConf).toHaveBeenCalledTwiceWith('readWriteHeatMapChart');
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

    const humanReadable = [
      'Read Byte/s',
      'Write Byte/s',
      'Read IOPS',
      'Write IOPS'
    ];
    values(readWriteHeatMapTypes).forEach((type, idx) => {
      it(
        'readable type should convert' + type + ' to ' + humanReadable[idx],
        () => {
          expect(config.toReadableType(type)).toEqual(humanReadable[idx]);
        }
      );
    });

    describe('options', () => {
      let d3Chart, axisInstance;

      beforeEach(() => {
        axisInstance = {
          ticks: jasmine.createSpy('ticks')
        };

        d3Chart = {
          margin: jasmine.createSpy('margin'),
          formatter: jasmine.createSpy('formatter'),
          zValue: jasmine.createSpy('zValue'),
          xAxis: jasmine.createSpy('xAxis').and.returnValue(axisInstance),
          xAxisLabel: jasmine.createSpy('xAxisLabel'),
          xAxisDetail: jasmine.createSpy('xAxisDetail'),
          dispatch: {
            on: jasmine.createSpy('on')
          }
        };
      });

      describe('on setup', () => {
        beforeEach(() => {
          config.options.setup(d3Chart);
        });

        it('should setup the margin', () => {
          expect(d3Chart.margin).toHaveBeenCalledOnceWith({
            left: 70,
            bottom: 50,
            right: 50
          });
        });

        it('should setup a formatter', () => {
          expect(d3Chart.formatter).toHaveBeenCalledOnceWith(
            jasmine.any(Function)
          );
        });

        it('should setup the z value', () => {
          expect(d3Chart.zValue).toHaveBeenCalledOnceWith(
            jasmine.any(Function)
          );
        });

        it('should set x axis ticks to 3', () => {
          expect(axisInstance.ticks).toHaveBeenCalledOnceWith(3);
        });

        it('should setup a click handler', () => {
          expect(d3Chart.dispatch.on).toHaveBeenCalledOnceWith(
            'click',
            jasmine.any(Function)
          );
        });

        it('should ensure that minimum distance between current and next is 30 seconds', () => {
          const onClick = d3Chart.dispatch.on.calls.argsFor(0)[1];
          const points = {
            current: {
              id: 1,
              ts: 1460659210347 // 2016-04-14T18:40:10.347Z
            },
            next: {
              ts: 1460659214570 // 2016-04-14T18:40:14.570Z
            }
          };

          onClick(points);

          expect($state.go).toHaveBeenCalledOnceWith('app.jobstats', {
            id: 1,
            startDate: '2016-04-14T18:39:44.570Z',
            endDate: '2016-04-14T18:40:14.570Z'
          });
        });
      });

      describe('before updating', () => {
        beforeEach(() => {
          config.options.beforeUpdate(d3Chart);
        });

        it('should setup a formatter', () => {
          expect(d3Chart.formatter).toHaveBeenCalledOnceWith(
            jasmine.any(Function)
          );
        });

        it('should setup the z value', () => {
          expect(d3Chart.zValue).toHaveBeenCalledOnceWith(
            jasmine.any(Function)
          );
        });

        it('should set x axis detail', () => {
          expect(d3Chart.xAxisDetail).toHaveBeenCalledOnceWith('Read Byte/s');
        });
      });
    });
  });

  describe('on submit', () => {
    let handler, $scope, config;

    beforeEach(
      inject($rootScope => {
        getReadWriteHeatMapChart(
          {
            qs: {
              host_id: '1'
            }
          },
          'readWriteHeatMapChart'
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
      ).toHaveBeenCalledOnceWith('UPDATE_READ_WRITE_HEAT_MAP_CHART_ITEMS', {
        page: 'readWriteHeatMapChart'
      });
    });

    it('should invoke the submit handler', () => {
      expect(submitHandler).toHaveBeenCalledOnce();
    });
  });
});
