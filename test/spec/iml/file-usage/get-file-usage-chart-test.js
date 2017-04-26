import highland from 'highland';
import angular from '../../../angular-mock-setup.js';

describe('file usage chart', () => {
  let mockChartCompiler,
    mockGetFileUsageStream,
    fileUsageStream,
    standardConfig,
    getFileUsageChart,
    getFileUsageChartFactory,
    config1$,
    config2$,
    selectStoreCount,
    mockGetStore,
    mockDurationPayload,
    submitHandler,
    mockDurationSubmitHandler,
    mockGetConf,
    initStream,
    data$Fn,
    localApply;

  beforeEach(() => {
    fileUsageStream = {};
    mockGetFileUsageStream = jest.fn(() => fileUsageStream);

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
    jest.spyOn(config1$, 'destroy');
    config2$ = highland([
      {
        target1: standardConfig
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

    initStream = highland();
    jest.spyOn(initStream, 'destroy');

    data$Fn = jest.fn((overrides, fn) => {
      fn();
      return initStream;
    });

    localApply = jest.fn();

    mockChartCompiler = jest.fn();

    jest.mock(
      '../../../../source/iml/file-usage/get-file-usage-stream.js',
      () => mockGetFileUsageStream
    );
    jest.mock(
      '../../../../source/iml/chart-compiler/chart-compiler.js',
      () => mockChartCompiler
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
      () => ({
        getConf: mockGetConf
      })
    );

    const mod = require('../../../../source/iml/file-usage/get-file-usage-chart.js');

    getFileUsageChartFactory = mod.default;
  });

  beforeEach(() => {
    getFileUsageChart = getFileUsageChartFactory(localApply, data$Fn);

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

    const s = mockChartCompiler.mock.calls[0][1];
    s.each(() => {});
  });

  it('should return a factory function', () => {
    expect(getFileUsageChart).toEqual(expect.any(Function));
  });

  it('should dispatch fileUsageChart to the store', () => {
    expect(mockGetStore.dispatch).toHaveBeenCalledOnceWith({
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
    expect(mockGetStore.select).toHaveBeenCalledOnceWith('fileUsageCharts');
  });

  it('should call getConf', () => {
    expect(mockGetConf).toHaveBeenCalledOnceWith('target1');
  });

  it('should call data$Fn', () => {
    expect(data$Fn).toHaveBeenCalledOnceWith(
      {
        qs: {
          host_id: '1'
        }
      },
      expect.any(Function),
      standardConfig
    );
  });

  it('should call the chart compiler', () => {
    expect(mockChartCompiler).toHaveBeenCalledOnceWith(
      `<div config-toggle>
  <h5>{{ chart.title }}</h5>
  <div class="controls" ng-if="configToggle.inactive()">
    <button class="btn btn-xs btn-primary" ng-click="configToggle.setActive()">Configure <i class="fa fa-cog"></i></button>
    <a full-screen-btn class="btn btn-primary btn-xs"></a>
    <a class="drag btn btn-xs btn-default">Drag <i class="fa fa-arrows"></i></a>
  </div>
  <div class="configuration" ng-if="configToggle.active()">
    <div class="well well-lg">
      <form name="fileUsageForm">
        <resettable-group>
          <duration-picker type="chart.configType" size="chart.size" unit="chart.unit" start-date="chart.startDate | toDate" end-date="chart.endDate | toDate"></duration-picker>
          <button type="submit" ng-click="::configToggle.setInactive(chart.onSubmit({}, fileUsageForm))" class="btn btn-success btn-block" ng-disabled="fileUsageForm.$invalid">Update</button>
          <button ng-click="::configToggle.setInactive()" class="btn btn-cancel btn-block" resetter>Cancel</button>
        </resettable-group>
      </form>
    </div>
  </div>
  <line-chart options="::chart.options" stream="chart.stream"></line-chart>
</div>`,
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should call getFileUsageStream with the key', () => {
    expect(mockGetFileUsageStream).toHaveBeenCalledWith('bar');
  });

  describe('config', () => {
    let handler, $scope, stream, config;

    beforeEach(
      angular.mock.inject($rootScope => {
        handler = mockChartCompiler.mock.calls[0][2];

        stream = highland();
        jest.spyOn(stream, 'destroy');
        $scope = $rootScope.$new();

        config = handler($scope, stream);
      })
    );

    it('should return a config', () => {
      expect(config).toEqual({
        title: 'foo',
        stream: expect.any(Object),
        configType: 'duration',
        page: '',
        startDate: 1464812942650,
        endDate: 1464812997102,
        size: 10,
        unit: 'minutes',
        onSubmit: expect.any(Function),
        options: {
          setup: expect.any(Function)
        }
      });
    });

    it('should select the fileUsageChart store', () => {
      expect(mockGetStore.select).toHaveBeenCalledTwiceWith('fileUsageCharts');
    });

    it('should call getConf', () => {
      expect(mockGetConf).toHaveBeenCalledTwiceWith('target1');
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
          format: jest.fn(() => formatter)
        };

        chart = {
          useInteractiveGuideline: jest.fn(),
          forceY: jest.fn(),
          yAxis: {
            tickFormat: jest.fn()
          },
          xAxis: {
            showMaxMin: jest.fn()
          },
          color: jest.fn(),
          isArea: jest.fn()
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
      angular.mock.inject($rootScope => {
        handler = mockChartCompiler.mock.calls[0][2];
        $scope = $rootScope.$new();

        config = handler($scope, initStream);

        config.onSubmit();
      })
    );

    it('should call durationSubmitHandler', () => {
      expect(
        mockDurationSubmitHandler
      ).toHaveBeenCalledOnceWith('UPDATE_FILE_USAGE_CHART_ITEMS', {
        page: 'target1'
      });
    });

    it('should invoke the submit handler', () => {
      expect(submitHandler).toHaveBeenCalledTimes(1);
    });
  });
});
