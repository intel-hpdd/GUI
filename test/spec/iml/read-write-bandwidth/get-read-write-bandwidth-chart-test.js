import highland from "highland";
import angular from "../../../angular-mock-setup.js";

describe("Read Write Bandwidth chart", () => {
  let mockChartCompiler,
    mockGetReadWriteBandwidthStream,
    selectStoreCount,
    submitHandler,
    config1$,
    config2$,
    getReadWriteBandwidthChart,
    mockGetStore,
    standardConfig,
    mockDurationPayload,
    data$Fn,
    initStream,
    mockDurationSubmitHandler,
    localApply,
    mod,
    mockGetConf;

  beforeEach(() => {
    mockGetReadWriteBandwidthStream = {};

    standardConfig = {
      configType: "duration",
      size: 10,
      unit: "minutes",
      startDate: 1464812942650,
      endDate: 1464812997102
    };

    config1$ = highland([
      {
        readWriteBandwidthChart: { ...standardConfig }
      }
    ]);
    jest.spyOn(config1$, "destroy");
    config2$ = highland([
      {
        readWriteBandwidthChart: { ...standardConfig }
      }
    ]);
    jest.spyOn(config2$, "destroy");
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

    mockChartCompiler = jest.fn();

    jest.mock(
      "../../../../source/iml/read-write-bandwidth/get-read-write-bandwidth-stream.js",
      () => mockGetReadWriteBandwidthStream
    );
    jest.mock("../../../../source/iml/chart-compiler/chart-compiler.js", () => mockChartCompiler);
    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);
    jest.mock("../../../../source/iml/duration-picker/duration-payload.js", () => mockDurationPayload);
    jest.mock("../../../../source/iml/duration-picker/duration-submit-handler.js", () => mockDurationSubmitHandler);
    jest.mock("../../../../source/iml/chart-transformers/chart-transformers.js", () => ({
      getConf: mockGetConf
    }));

    mod = require("../../../../source/iml/read-write-bandwidth/get-read-write-bandwidth-chart.js");
  });

  beforeEach(() => {
    initStream = highland();
    jest.spyOn(initStream, "destroy");

    data$Fn = jest.fn(() => initStream);

    localApply = jest.fn();

    getReadWriteBandwidthChart = mod.default(data$Fn, localApply);
  });

  it("should return a factory function", () => {
    expect(getReadWriteBandwidthChart).toEqual(expect.any(Function));
  });

  describe("for page readWriteBandwidthChart", () => {
    beforeEach(() => {
      getReadWriteBandwidthChart(
        {
          qs: {
            host_id: "1"
          }
        },
        "readWriteBandwidthChart"
      );

      const s = mockChartCompiler.mock.calls[0][1];
      s.each(() => {});
    });

    it("should dispatch readWriteBandwidthChart to the store", () => {
      expect(mockGetStore.dispatch).toHaveBeenCalledOnceWith({
        type: "DEFAULT_READ_WRITE_BANDWIDTH_CHART_ITEMS",
        payload: {
          page: "readWriteBandwidthChart",
          configType: "duration",
          size: 10,
          unit: "minutes",
          startDate: 1464812942650,
          endDate: 1464812997102
        }
      });
    });

    it("should select the readWriteBandwidthChart store", () => {
      expect(mockGetStore.select).toHaveBeenCalledOnceWith("readWriteBandwidthCharts");
    });

    it("should call getConf", () => {
      expect(mockGetConf).toHaveBeenCalledOnceWith("readWriteBandwidthChart");
    });

    it("should call data$Fn", () => {
      expect(data$Fn).toHaveBeenCalledOnceWith(
        {
          qs: {
            host_id: "1"
          }
        },
        expect.any(Function),
        standardConfig
      );
    });

    it("should call the chart compiler", () => {
      expect(mockChartCompiler).toHaveBeenCalledOnceWith(
        `<div config-toggle>
  <h5>Read/Write Bandwidth</h5>
  <div class="controls" ng-if="configToggle.inactive()">
    <button class="btn btn-xs btn-primary" ng-click="configToggle.setActive()">Configure <i class="fa fa-cog"></i></button>
    <a full-screen-btn class="btn btn-primary btn-xs"></a>
    <a class="drag btn btn-xs btn-default">Drag <i class="fa fa-arrows"></i></a>
  </div>
  <div class="configuration" ng-if="configToggle.active()">
    <div class="well well-lg">
      <form name="readWriteBandwidthForm">
        <resettable-group>
          <duration-picker type="chart.configType" size="chart.size" unit="chart.unit" start-date="chart.startDate | toDate" end-date="chart.endDate | toDate"></duration-picker>
          <button type="submit" ng-click="::configToggle.setInactive(chart.onSubmit({}, readWriteBandwidthForm))" class="btn btn-success btn-block" ng-disabled="readWriteBandwidthForm.$invalid">Update</button>
          <button ng-click="::configToggle.setInactive()" class="btn btn-cancel btn-block" resetter>Cancel</button>
        </resettable-group>
      </form>
    </div>
  </div>
  <line-chart options="::chart.options" stream="::chart.stream"></line-chart>
</div>`,
        expect.any(Object),
        expect.any(Function)
      );
    });
  });

  describe("setup", () => {
    let handler, $scope, config;

    beforeEach(
      angular.mock.inject($rootScope => {
        getReadWriteBandwidthChart(
          {
            qs: {
              host_id: "1"
            }
          },
          "readWriteBandwidthChart"
        );

        handler = mockChartCompiler.mock.calls[0][2];
        $scope = $rootScope.$new();

        config = handler($scope, initStream);
      })
    );

    it("should return a config", () => {
      expect(config).toEqual({
        stream: initStream,
        configType: "duration",
        page: "",
        startDate: 1464812942650,
        endDate: 1464812997102,
        size: 10,
        unit: "minutes",
        onSubmit: submitHandler,
        options: {
          setup: expect.any(Function)
        }
      });
    });

    it("should select the readWriteBandwidthChart store", () => {
      expect(mockGetStore.select).toHaveBeenCalledTwiceWith("readWriteBandwidthCharts");
    });

    it("should call getConf", () => {
      expect(mockGetConf).toHaveBeenCalledTwiceWith("readWriteBandwidthChart");
    });

    it("should call localApply", () => {
      expect(localApply).toHaveBeenCalledOnceWith($scope);
    });

    it("should destroy the stream when the chart is destroyed", () => {
      $scope.$destroy();

      expect(initStream.destroy).toHaveBeenCalled();
      expect(config1$.destroy).toHaveBeenCalled();
      expect(config2$.destroy).toHaveBeenCalled();
    });

    describe("chart", () => {
      let chart;

      beforeEach(() => {
        chart = {
          useInteractiveGuideline: jest.fn(),
          xAxis: {
            showMaxMin: jest.fn()
          },
          yAxis: {
            tickFormat: jest.fn()
          },
          color: jest.fn(),
          isArea: jest.fn()
        };

        config.options.setup(chart);
      });

      it("should use interactive guideline", () => {
        expect(chart.useInteractiveGuideline).toHaveBeenCalledOnceWith(true);
      });

      it("should set y tick format", () => {
        expect(chart.yAxis.tickFormat).toHaveBeenCalledOnceWith(expect.any(Function));
      });

      it("should set colors", () => {
        expect(chart.color).toHaveBeenCalledOnceWith(["#0067B4", "#E17200"]);
      });

      it("should use the area style", () => {
        expect(chart.isArea).toHaveBeenCalledOnceWith(true);
      });

      it("should not show max or min on the x axis", () => {
        expect(chart.xAxis.showMaxMin).toHaveBeenCalledOnceWith(false);
      });
    });
  });

  describe("on submit", () => {
    let handler, $scope, config;

    beforeEach(
      angular.mock.inject($rootScope => {
        getReadWriteBandwidthChart(
          {
            qs: {
              host_id: "1"
            }
          },
          "readWriteBandwidthChart"
        );

        handler = mockChartCompiler.mock.calls[0][2];
        $scope = $rootScope.$new();

        config = handler($scope, initStream);

        config.onSubmit();
      })
    );

    it("should call durationSubmitHandler", () => {
      expect(mockDurationSubmitHandler).toHaveBeenCalledOnceWith("UPDATE_READ_WRITE_BANDWIDTH_CHART_ITEMS", {
        page: "readWriteBandwidthChart"
      });
    });

    it("should invoke the submit handler", () => {
      expect(submitHandler).toHaveBeenCalledTimes(1);
    });
  });
});
