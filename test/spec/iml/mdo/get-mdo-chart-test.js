import highland from "highland";
import angular from "../../../angular-mock-setup.js";

describe("MDO chart", () => {
  let mockChartCompiler,
    mockGetMdoStream,
    selectStoreCount,
    submitHandler,
    config1$,
    config2$,
    getMdoChart,
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
    mockGetMdoStream = {};

    standardConfig = {
      configType: "duration",
      size: 10,
      unit: "minutes",
      startDate: 1464812942650,
      endDate: 1464812997102
    };

    config1$ = highland([
      {
        mdoChart: { ...standardConfig }
      }
    ]);
    jest.spyOn(config1$, "destroy");
    config2$ = highland([
      {
        mdoChart: standardConfig
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

    jest.mock("../../../../source/iml/mdo/get-mdo-stream.js", () => mockGetMdoStream);
    jest.mock("../../../../source/iml/chart-compiler/chart-compiler.js", () => mockChartCompiler);
    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);
    jest.mock("../../../../source/iml/duration-picker/duration-payload.js", () => mockDurationPayload);
    jest.mock("../../../../source/iml/duration-picker/duration-submit-handler.js", () => mockDurationSubmitHandler);
    jest.mock("../../../../source/iml/chart-transformers/chart-transformers.js", () => ({
      getConf: mockGetConf
    }));

    mod = require("../../../../source/iml/mdo/get-mdo-chart.js");
  });

  beforeEach(() => {
    initStream = highland();
    jest.spyOn(initStream, "destroy");

    data$Fn = jest.fn(() => initStream);

    localApply = jest.fn();

    getMdoChart = mod.default(localApply, data$Fn);
  });

  it("should return a factory function", () => {
    expect(getMdoChart).toEqual(expect.any(Function));
  });

  describe("for page mdoChart", () => {
    beforeEach(() => {
      getMdoChart(
        {
          qs: {
            host_id: "1"
          }
        },
        "mdoChart"
      );

      const s = mockChartCompiler.mock.calls[0][1];
      s.each(() => {});
    });

    it("should dispatch mdoChart to the store", () => {
      expect(mockGetStore.dispatch).toHaveBeenCalledOnceWith({
        type: "DEFAULT_MDO_CHART_ITEMS",
        payload: {
          page: "mdoChart",
          configType: "duration",
          size: 10,
          unit: "minutes",
          startDate: 1464812942650,
          endDate: 1464812997102
        }
      });
    });

    it("should select the mdoChart store", () => {
      expect(mockGetStore.select).toHaveBeenCalledOnceWith("mdoCharts");
    });

    it("should call getConf", () => {
      expect(mockGetConf).toHaveBeenCalledOnceWith("mdoChart");
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
  <h5>Metadata Operations</h5>
  <div class="controls" ng-if="configToggle.inactive()">
    <button class="btn btn-xs btn-primary" ng-click="configToggle.setActive()">Configure <i class="fa fa-cog"></i></button>
    <a full-screen-btn class="btn btn-primary btn-xs"></a>
    <a class="drag btn btn-xs btn-default">Drag <i class="fa fa-arrows"></i></a>
  </div>
  <div class="configuration" ng-if="configToggle.active()">
    <div class="well well-lg">
      <form name="mdoForm">
        <resettable-group>
          <duration-picker type="chart.configType" size="chart.size" unit="chart.unit" start-date="chart.startDate | toDate" end-date="chart.endDate | toDate"></duration-picker>
          <button type="submit" ng-click="::configToggle.setInactive(chart.onSubmit({}, mdoForm))" class="btn btn-success btn-block" ng-disabled="mdoForm.$invalid">Update</button>
          <button ng-click="::configToggle.setInactive()" class="btn btn-cancel btn-block" resetter>Cancel</button>
        </resettable-group>
      </form>
    </div>
  </div>
  <stacked-area-chart options="::chart.options" stream="chart.stream"></stacked-area-chart>
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
        getMdoChart(
          {
            qs: {
              host_id: "1"
            }
          },
          "mdoChart"
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

    it("should select the mdoChart store", () => {
      expect(mockGetStore.select).toHaveBeenCalledTwiceWith("mdoCharts");
    });

    it("should call getConf", () => {
      expect(mockGetConf).toHaveBeenCalledTwiceWith("mdoChart");
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
      let chart, tickFormat;

      beforeEach(() => {
        tickFormat = jest.fn();

        chart = {
          useInteractiveGuideline: jest.fn(),
          interactiveLayer: {
            tooltip: {
              headerFormatter: jest.fn()
            }
          },
          yAxis: {
            tickFormat: tickFormat
          },
          forceY: jest.fn(),
          xAxis: {
            showMaxMin: jest.fn()
          }
        };

        config.options.setup(chart);
      });

      it("should use interactive guideline", () => {
        expect(chart.useInteractiveGuideline).toHaveBeenCalledOnceWith(true);
      });

      it("should should force y", () => {
        expect(chart.forceY).toHaveBeenCalledOnceWith([0, 1]);
      });

      it("should set y tick format", () => {
        expect(tickFormat).toHaveBeenCalledOnceWith(expect.any(Function));
      });

      it("should not show max or min over the x axis", () => {
        expect(chart.xAxis.showMaxMin).toHaveBeenCalledOnceWith(false);
      });
    });
  });

  describe("on submit", () => {
    let handler, $scope, config;

    beforeEach(
      angular.mock.inject($rootScope => {
        getMdoChart(
          {
            qs: {
              host_id: "1"
            }
          },
          "mdoChart"
        );

        handler = mockChartCompiler.mock.calls[0][2];
        $scope = $rootScope.$new();

        config = handler($scope, initStream);

        config.onSubmit();
      })
    );

    it("should call durationSubmitHandler", () => {
      expect(mockDurationSubmitHandler).toHaveBeenCalledOnceWith("UPDATE_MDO_CHART_ITEMS", {
        page: "mdoChart"
      });
    });

    it("should invoke the submit handler", () => {
      expect(submitHandler).toHaveBeenCalledTimes(1);
    });
  });
});
