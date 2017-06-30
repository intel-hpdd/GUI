import angular from '../../../angular-mock-setup.js';
import highland from 'highland';

import { values } from '@iml/obj';

describe('Read Write Heat Map chart', () => {
  let mockChartCompiler,
    mockGetReadWriteHeatMapStream,
    selectStoreCount,
    submitHandler,
    config1$,
    config2$,
    getReadWriteHeatMapChart,
    mockGetStore,
    standardConfig,
    mockDurationPayload,
    initStream,
    mockDurationSubmitHandler,
    localApply,
    mod,
    mockGetConf,
    streamWhenVisible,
    $state;

  const readWriteHeatMapTypes = {
    READ_BYTES: 'stats_read_bytes',
    WRITE_BYTES: 'stats_write_bytes',
    READ_IOPS: 'stats_read_iops',
    WRITE_IOPS: 'stats_write_iops'
  };

  beforeEach(() => {
    mockGetReadWriteHeatMapStream = jest.fn();

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
    jest.spyOn(config1$, 'destroy');
    config2$ = highland([
      {
        readWriteHeatMapChart: standardConfig
      }
    ]);
    jest.spyOn(config2$, 'destroy');
    selectStoreCount = 0;

    mockGetStore = {
      dispatch: jest.fn(),
      select: jest.fn(() => {
        switch (selectStoreCount) {
          case 0:
            selectStoreCount++;
            return config1$;
          default:
            return config2$;
        }
      })
    };

    mockDurationPayload = jest.fn(x => {
      return { ...standardConfig, ...x };
    });

    submitHandler = jest.fn();
    mockDurationSubmitHandler = jest.fn(() => submitHandler);

    mockGetConf = jest.fn(page => {
      return s => {
        return s.map(x => {
          return x[page];
        });
      };
    });

    streamWhenVisible = jest.fn(fn => fn().consume().each(() => {}));

    mockChartCompiler = jest.fn();

    jest.mock(
      '../../../../source/iml/read-write-heat-map/get-read-write-heat-map-stream.js',
      () => mockGetReadWriteHeatMapStream
    );
    jest.mock('../../../../source/iml/store/get-store.js', () => mockGetStore);
    jest.mock(
      '../../../../source/iml/duration-picker/duration-payload.js',
      () => mockDurationPayload
    );
    jest.mock(
      '../../../../source/iml/duration-picker/duration-submit-handler.js',
      () => mockDurationSubmitHandler
    );
    jest.mock(
      '../../../../source/iml/chart-transformers/chart-transformers.js',
      () => ({ getConf: mockGetConf })
    );
    jest.mock(
      '../../../../source/iml/chart-compiler/chart-compiler.js',
      () => mockChartCompiler
    );
    jest.mock(
      '../../../../source/iml/read-write-heat-map/assets/html/read-write-heat-map.html',
      () => 'heatMapTemplate'
    );
    jest.mock('../../../../source/iml/environment.js', () => ({
      SERVER_TIME_DIFF: 270
    }));

    mod = require('../../../../source/iml/read-write-heat-map/get-read-write-heat-map-chart.js');
  });

  beforeEach(() => {
    initStream = highland();

    mockGetReadWriteHeatMapStream.mockReturnValue(initStream);

    jest.spyOn(initStream, 'destroy');

    localApply = jest.fn();

    $state = {
      go: jest.fn()
    };

    getReadWriteHeatMapChart = mod.default(
      $state,
      localApply,
      readWriteHeatMapTypes,
      streamWhenVisible
    );
  });

  it('should return a factory function', () => {
    expect(getReadWriteHeatMapChart).toEqual(expect.any(Function));
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

      const s = mockChartCompiler.mock.calls[0][1];
      s.each(() => {});
    });

    it('should dispatch readWriteHeatMapChart to the store', () => {
      expect(mockGetStore.dispatch).toHaveBeenCalledOnceWith({
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
      expect(mockGetStore.select).toHaveBeenCalledOnceWith(
        'readWriteHeatMapCharts'
      );
    });

    it('should call getConf', () => {
      expect(mockGetConf).toHaveBeenCalledOnceWith('readWriteHeatMapChart');
    });

    it('should call getReadWriteHeatMapStream with the dataType', () => {
      expect(mockGetReadWriteHeatMapStream).toHaveBeenCalledOnceWith(
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
      expect(mockChartCompiler).toHaveBeenCalledOnceWith(
        'heatMapTemplate',
        expect.any(Object),
        expect.any(Function)
      );
    });
  });

  describe('setup', () => {
    let handler, $scope, config;

    beforeEach(
      angular.mock.inject($rootScope => {
        getReadWriteHeatMapChart(
          {
            qs: {
              host_id: '1'
            }
          },
          'readWriteHeatMapChart'
        );

        handler = mockChartCompiler.mock.calls[0][2];
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
        toReadableType: expect.any(Function),
        startDate: 1464812942650,
        endDate: 1464812997102,
        size: 10,
        unit: 'minutes',
        onSubmit: submitHandler,
        options: {
          setup: expect.any(Function),
          beforeUpdate: expect.any(Function)
        }
      });
    });

    it('should select the readWriteHeatMapChart store', () => {
      expect(mockGetStore.select).toHaveBeenCalledTwiceWith(
        'readWriteHeatMapCharts'
      );
    });

    it('should call getConf', () => {
      expect(mockGetConf).toHaveBeenCalledTwiceWith('readWriteHeatMapChart');
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
          ticks: jest.fn()
        };

        d3Chart = {
          margin: jest.fn(),
          formatter: jest.fn(),
          zValue: jest.fn(),
          xAxis: jest.fn(() => axisInstance),
          xAxisLabel: jest.fn(),
          xAxisDetail: jest.fn(),
          dispatch: {
            on: jest.fn()
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
            expect.any(Function)
          );
        });

        it('should setup the z value', () => {
          expect(d3Chart.zValue).toHaveBeenCalledOnceWith(expect.any(Function));
        });

        it('should set x axis ticks to 3', () => {
          expect(axisInstance.ticks).toHaveBeenCalledOnceWith(3);
        });

        it('should setup a click handler', () => {
          expect(d3Chart.dispatch.on).toHaveBeenCalledOnceWith(
            'click',
            expect.any(Function)
          );
        });

        it('should ensure that minimum distance between current and next is 30 seconds', () => {
          const onClick = d3Chart.dispatch.on.mock.calls[0][1];
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
            expect.any(Function)
          );
        });

        it('should setup the z value', () => {
          expect(d3Chart.zValue).toHaveBeenCalledOnceWith(expect.any(Function));
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
      angular.mock.inject($rootScope => {
        getReadWriteHeatMapChart(
          {
            qs: {
              host_id: '1'
            }
          },
          'readWriteHeatMapChart'
        );

        handler = mockChartCompiler.mock.calls[0][2];
        $scope = $rootScope.$new();

        config = handler($scope, initStream);

        config.onSubmit();
      })
    );

    it('should call durationSubmitHandler', () => {
      expect(
        mockDurationSubmitHandler
      ).toHaveBeenCalledOnceWith('UPDATE_READ_WRITE_HEAT_MAP_CHART_ITEMS', {
        page: 'readWriteHeatMapChart'
      });
    });

    it('should invoke the submit handler', () => {
      expect(submitHandler).toHaveBeenCalledTimes(1);
    });
  });
});
