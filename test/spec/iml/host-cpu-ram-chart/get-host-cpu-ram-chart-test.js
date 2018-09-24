import highland from "highland";

import angular from "../../../angular-mock-setup.js";

describe("Host Cpu Ram chart", () => {
  let mockChartCompiler,
    mockGetHostCpuRamStream,
    selectStoreCount,
    submitHandler,
    config1$,
    config2$,
    getHostCpuRamChart,
    mockGetStore,
    standardConfig,
    mockDurationPayload,
    data$Fn,
    initStream,
    mockDurationSubmitHandler,
    localApply,
    mod,
    mockGetConf;

  beforeEach(async () => {
    mockGetHostCpuRamStream = {};

    standardConfig = {
      configType: "duration",
      size: 10,
      unit: "minutes",
      startDate: 1464812942650,
      endDate: 1464812997102
    };

    config1$ = highland([
      {
        hostCpuRamChart: { ...standardConfig }
      }
    ]);
    jest.spyOn(config1$, "destroy");
    config2$ = highland([
      {
        hostCpuRamChart: { ...standardConfig }
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

    jest.mock("../../../../source/iml/host-cpu-ram-chart/get-host-cpu-ram-stream.js", () => mockGetHostCpuRamStream);

    jest.mock("../../../../source/iml/chart-compiler/chart-compiler.js", () => mockChartCompiler);

    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);

    jest.mock("../../../../source/iml/duration-picker/duration-payload.js", () => mockDurationPayload);

    jest.mock("../../../../source/iml/duration-picker/duration-submit-handler.js", () => mockDurationSubmitHandler);

    jest.mock("../../../../source/iml/chart-transformers/chart-transformers.js", () => ({
      getConf: mockGetConf
    }));

    mod = require("../../../../source/iml/host-cpu-ram-chart/get-host-cpu-ram-chart.js").default;
  });

  beforeEach(() => {
    initStream = highland();
    jest.spyOn(initStream, "destroy");

    data$Fn = jest.fn(() => initStream);

    localApply = jest.fn();

    getHostCpuRamChart = mod(data$Fn, localApply);
  });

  it("should return a factory function", () => {
    expect(getHostCpuRamChart).toEqual(expect.any(Function));
  });

  describe("for page hostCpuRamChart", () => {
    beforeEach(() => {
      getHostCpuRamChart(
        "Object Storage Server",
        {
          qs: {
            host_id: "1"
          }
        },
        "hostCpuRamChart"
      );

      const s = mockChartCompiler.mock.calls[0][1];
      s.each(() => {});
    });

    it("should dispatch hostCpuRamChart to the store", () => {
      expect(mockGetStore.dispatch).toHaveBeenCalledOnceWith({
        type: "DEFAULT_HOST_CPU_RAM_CHART_ITEMS",
        payload: {
          page: "hostCpuRamChart",
          configType: "duration",
          size: 10,
          unit: "minutes",
          startDate: 1464812942650,
          endDate: 1464812997102
        }
      });
    });

    it("should select the hostCpuRamChart store", () => {
      expect(mockGetStore.select).toHaveBeenCalledOnceWith("hostCpuRamCharts");
    });

    it("should call getConf", () => {
      expect(mockGetConf).toHaveBeenCalledOnceWith("hostCpuRamChart");
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
  <h5>{{ chart.title }}</h5>
  <div class="controls" ng-if="configToggle.inactive()">
    <button class="btn btn-xs btn-primary" ng-click="configToggle.setActive()">Configure <i class="fa fa-cog"></i></button>
    <a full-screen-btn class="btn btn-primary btn-xs"></a>
    <a class="drag btn btn-xs btn-default">Drag <i class="fa fa-arrows"></i></a>
  </div>
  <div class="configuration" ng-if="configToggle.active()">
    <div class="well well-lg">
      <form name="hostCpuRamForm">
        <resettable-group>
          <duration-picker type="chart.configType" size="chart.size" unit="chart.unit" start-date="chart.startDate | toDate" end-date="chart.endDate | toDate"></duration-picker>
          <button type="submit" ng-click="::configToggle.setInactive(chart.onSubmit({}, hostCpuRamForm))" class="btn btn-success btn-block" ng-disabled="hostCpuRamForm.$invalid">Update</button>
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
        getHostCpuRamChart(
          "Object Storage Server",
          {
            qs: {
              host_id: "1"
            }
          },
          "hostCpuRamChart"
        );

        handler = mockChartCompiler.mock.calls[0][2];
        $scope = $rootScope.$new();

        config = handler($scope, initStream);
      })
    );

    it("should return a config", () => {
      expect(config).toEqual({
        title: "Object Storage Server",
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

    it("should select the hostCpuRamChart store", () => {
      expect(mockGetStore.select).toHaveBeenCalledTwiceWith("hostCpuRamCharts");
    });

    it("should call getConf", () => {
      expect(mockGetConf).toHaveBeenCalledTwiceWith("hostCpuRamChart");
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
      let chart, d3, formatter;

      beforeEach(() => {
        formatter = {};

        d3 = {
          format: jest.fn(() => formatter)
        };

        chart = {
          useInteractiveGuideline: jest.fn(),
          forceY: jest.fn(),
          yAxis: {
            tickFormat: jest.fn()
          },
          color: jest.fn()
        };

        config.options.setup(chart, d3);
      });

      it("should use interactive guideline", () => {
        expect(chart.useInteractiveGuideline).toHaveBeenCalledOnceWith(true);
      });

      it("should should force y", () => {
        expect(chart.forceY).toHaveBeenCalledOnceWith([0, 1]);
      });

      it("should set y tick format", () => {
        expect(chart.yAxis.tickFormat).toHaveBeenCalledOnceWith(formatter);
      });

      it("should should create a tick formatter", () => {
        expect(d3.format).toHaveBeenCalledOnceWith(".1%");
      });

      it("should set colors", () => {
        expect(chart.color).toHaveBeenCalledOnceWith(["#F3B600", "#0067B4"]);
      });
    });
  });

  describe("on submit", () => {
    let handler, $scope, config;

    beforeEach(
      angular.mock.inject($rootScope => {
        getHostCpuRamChart(
          "Object Storage Server",
          {
            qs: {
              host_id: "1"
            }
          },
          "hostCpuRamChart"
        );

        handler = mockChartCompiler.mock.calls[0][2];
        $scope = $rootScope.$new();

        config = handler($scope, initStream);

        config.onSubmit();
      })
    );

    it("should call durationSubmitHandler", () => {
      expect(mockDurationSubmitHandler).toHaveBeenCalledOnceWith("UPDATE_HOST_CPU_RAM_CHART_ITEMS", {
        page: "hostCpuRamChart"
      });
    });

    it("should invoke the submit handler", () => {
      expect(submitHandler).toHaveBeenCalledTimes(1);
    });
  });
});
