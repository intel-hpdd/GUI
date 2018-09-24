import highland from "highland";
import angular from "../../../angular-mock-setup.js";

describe("get agent vs copytool chart exports", () => {
  let mockGetAgentVsCopytoolStream,
    mockD3,
    mockCreateDate,
    mockChartCompiler,
    getAgentVsCopytoolChart,
    agentVsCopytoolChart,
    d3,
    timeScale,
    linearScale,
    ordinalScale,
    getAgentVsCopytoolChartFactory,
    standardConfig,
    config1$,
    config2$,
    selectStoreCount,
    mockGetStore,
    mockDurationPayload,
    submitHandler,
    mockDurationSubmitHandler,
    mockGetConf,
    localApply,
    data$Fn,
    initStream;

  beforeEach(() => {
    mockGetAgentVsCopytoolStream = jest.fn();
    mockCreateDate = jest.fn(x => x);

    standardConfig = {
      configType: "duration",
      size: 10,
      unit: "minutes",
      startDate: 1464812942650,
      endDate: 1464812997102
    };

    config1$ = highland([
      {
        base: { ...standardConfig }
      }
    ]);
    jest.spyOn(config1$, "destroy");
    config2$ = highland([
      {
        base: standardConfig
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

    localApply = jest.fn();

    initStream = highland();
    jest.spyOn(initStream, "destroy");

    data$Fn = jest.fn((overrides, fn) => {
      fn()();
      return initStream;
    });

    mockChartCompiler = jest.fn(() => "chartCompiler");

    jest.mock(
      "../../../../source/iml/agent-vs-copytool/get-agent-vs-copytool-stream.js",
      () => mockGetAgentVsCopytoolStream
    );
    jest.mock("../../../../source/iml/chart-compiler/chart-compiler.js", () => mockChartCompiler);
    jest.mock("../../../../source/iml/create-date.js", () => mockCreateDate);
    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);
    jest.mock("../../../../source/iml/duration-picker/duration-payload.js", () => mockDurationPayload);
    jest.mock("../../../../source/iml/duration-picker/duration-submit-handler.js", () => mockDurationSubmitHandler);
    jest.mock("../../../../source/iml/chart-transformers/chart-transformers.js", () => ({ getConf: mockGetConf }));
    mockD3 = require("d3");

    const mod = require("../../../../source/iml/agent-vs-copytool/get-agent-vs-copytool-chart.js");

    getAgentVsCopytoolChartFactory = mod.default;
  });

  beforeEach(() => {
    jest.spyOn(mockD3.time, "scale").mockImplementation(() => {
      timeScale = {};

      timeScale.domain = jest.fn(() => timeScale);
      timeScale.range = jest.fn(() => timeScale);

      return timeScale;
    });
    jest.spyOn(mockD3.scale, "linear").mockImplementation(() => {
      linearScale = {};

      linearScale.domain = jest.fn(() => linearScale);
      linearScale.range = jest.fn(() => linearScale);

      return linearScale;
    });
    jest.spyOn(mockD3.scale, "ordinal").mockImplementation(() => {
      ordinalScale = {};

      ordinalScale.domain = jest.fn(xs => {
        if (xs) return ordinalScale;
        else return currentRange;
      });

      let currentRange;
      ordinalScale.range = jest.fn(xs => {
        if (xs) {
          currentRange = xs;
          return ordinalScale;
        } else {
          return currentRange;
        }
      });

      return ordinalScale;
    });

    getAgentVsCopytoolChart = getAgentVsCopytoolChartFactory(localApply, data$Fn, d3);

    agentVsCopytoolChart = getAgentVsCopytoolChart({
      foo: "bar"
    });

    const s = mockChartCompiler.mock.calls[0][1];
    s.each(() => {});
  });

  it("should return a function", () => {
    expect(getAgentVsCopytoolChart).toEqual(expect.any(Function));
  });

  it("should dispatch to the store", () => {
    expect(mockGetStore.dispatch).toHaveBeenCalledOnceWith({
      type: "DEFAULT_AGENT_VS_COPYTOOL_CHART_ITEMS",
      payload: {
        page: "base",
        configType: "duration",
        size: 10,
        unit: "minutes",
        startDate: 1464812942650,
        endDate: 1464812997102
      }
    });
  });

  it("should select the agentVsCopytoolCharts store", () => {
    expect(mockGetStore.select).toHaveBeenCalledOnceWith("agentVsCopytoolCharts");
  });

  it("should call getConf", () => {
    expect(mockGetConf).toHaveBeenCalledOnceWith("base");
  });

  it("should call data$Fn", () => {
    expect(data$Fn).toHaveBeenCalledOnceWith(
      {
        foo: "bar"
      },
      expect.any(Function),
      standardConfig
    );
  });

  it("should invoke the getAgentVsCopytoolStream", () => {
    expect(mockGetAgentVsCopytoolStream).toHaveBeenCalledTimes(1);
  });

  it("should invoke the chart compiler", () => {
    expect(mockChartCompiler).toHaveBeenCalledOnceWith(
      `<div config-toggle class="agent-vs-copytool">
  <div class="controls" ng-if="configToggle.inactive()">
    <button class="btn btn-xs btn-primary" ng-click="configToggle.setActive()">Configure <i class="fa fa-cog"></i></button>
  </div>
  <div class="configuration" ng-if="configToggle.active()">
    <div class="well well-lg">
      <form name="form">
        <resettable-group>
          <duration-picker type="chart.configType" size="chart.size" unit="chart.unit" start-date="chart.startDate | toDate" end-date="chart.endDate | toDate"></duration-picker>
          <button type="submit"
                  ng-click="::configToggle.setInactive(chart.onSubmit({}, form))"
                  class="btn btn-success btn-block"
                  ng-disabled="form.$invalid">Update</button>
          <button ng-click="::configToggle.setInactive()" class="btn btn-cancel btn-block" resetter>Cancel</button>
        </resettable-group>
      </form>
    </div>
  </div>
  <div charter class="agent-vs-copytool-chart" stream="chart.stream" on-update="::chart.onUpdate">
    <g axis scale="::chart.yScale" orient="'left'"></g>
    <g axis scale="::chart.xScale" orient="'bottom'"></g>
    <g legend scale="::chart.nameColorScale"></g>
    <g label on-data="::chart.calcRange" on-update="::chart.rangeLabelOnUpdate"></g>
    <g line scale-y="::chart.yScale" scale-x="::chart.xScale" value-x="::chart.xValue" value-y="::chart.labels[0]" color="::chart.colors[0]" comparator-x="::chart.xComparator"></g>
    <g line scale-y="::chart.yScale" scale-x="::chart.xScale" value-x="::chart.xValue" value-y="::chart.labels[1]" color="::chart.colors[1]" comparator-x="::chart.xComparator"></g>
    <g line scale-y="::chart.yScale" scale-x="::chart.xScale" value-x="::chart.xValue" value-y="::chart.labels[2]" color="::chart.colors[2]" comparator-x="::chart.xComparator"></g>
  </div>
</div>`,
      expect.any(Object),
      expect.any(Function)
    );
  });

  it("should return a chart compiler", () => {
    expect(agentVsCopytoolChart).toBe("chartCompiler");
  });

  it("should create a xScale", () => {
    expect(mockD3.time.scale).toHaveBeenCalledTimes(1);
  });

  it("should create a yScale", () => {
    expect(mockD3.scale.linear).toHaveBeenCalled();
  });

  describe("name color scale", () => {
    it("should be an ordinal scale", () => {
      expect(mockD3.scale.ordinal).toHaveBeenCalledTimes(1);
    });

    it("should set the domain", () => {
      expect(ordinalScale.domain).toHaveBeenCalledOnceWith(["running actions", "waiting requests", "idle workers"]);
    });

    it("should set the range", () => {
      expect(ordinalScale.range).toHaveBeenCalledOnceWith(["#F3B600", "#A3B600", "#0067B4"]);
    });
  });

  describe("compiler", () => {
    let $scope, s, config;

    beforeEach(
      angular.mock.inject($rootScope => {
        $scope = $rootScope.$new();
        s = highland();
        jest.spyOn(s, "destroy");
        config = mockChartCompiler.mock.calls[0][2]($scope, s);
      })
    );

    it("should return a conf", () => {
      expect(config).toEqual({
        stream: s,
        configType: "duration",
        page: "",
        startDate: 1464812942650,
        endDate: 1464812997102,
        size: 10,
        unit: "minutes",
        xScale: timeScale,
        yScale: linearScale,
        onUpdate: [expect.any(Function), expect.any(Function), expect.any(Function), expect.any(Function)],
        rangeLabelOnUpdate: [expect.any(Function), expect.any(Function), expect.any(Function)],
        labels: [expect.any(Function), expect.any(Function), expect.any(Function)],
        colors: ["#F3B600", "#A3B600", "#0067B4"],
        nameColorScale: ordinalScale,
        calcRange: expect.any(Function),
        xValue: expect.any(Function),
        xComparator: expect.any(Function),
        onSubmit: expect.any(Function)
      });
    });

    it("should destroy the stream when the chart is destroyed", () => {
      $scope.$destroy();

      expect(initStream.destroy).toHaveBeenCalled();
      expect(config1$.destroy).toHaveBeenCalled();
      expect(config2$.destroy).toHaveBeenCalled();
    });

    describe("on update", () => {
      it("should update xScale domain", () => {
        config.onUpdate[0]({
          xs: [
            {
              ts: "1"
            },
            {
              ts: "2"
            }
          ]
        });

        expect(timeScale.domain).toHaveBeenCalledOnceWith(["1", "2"]);
      });

      it("should update yScale domain", () => {
        config.onUpdate[1]({
          xs: [
            {
              a: 100,
              ts: 10000
            },
            {
              b: 9000
            },
            {
              c: 200
            }
          ]
        });

        expect(linearScale.domain).toHaveBeenCalledOnceWith([0, 9001]);
      });

      it("should update xScale range", () => {
        config.onUpdate[2]({ width: 500 });

        expect(timeScale.range).toHaveBeenCalledOnceWith([0, 500]);
      });

      it("should update yScale Range", () => {
        config.onUpdate[3]({ height: 300 });

        expect(linearScale.range).toHaveBeenCalledOnceWith([280, 30]);
      });

      describe("range label on update", () => {
        it("should update label width", () => {
          const label = {
            width: jest.fn()
          };

          config.rangeLabelOnUpdate[0]({
            label,
            width: 50
          });

          expect(label.width).toHaveBeenCalledOnceWith(50);
        });

        it("should update label height", () => {
          const label = {
            height: jest.fn()
          };

          config.rangeLabelOnUpdate[1]({
            label
          });

          expect(label.height).toHaveBeenCalledOnceWith(20);
        });

        it("should translate node", () => {
          const node = {
            attr: jest.fn()
          };

          config.rangeLabelOnUpdate[2]({
            node,
            height: 60
          });

          expect(node.attr).toHaveBeenCalledOnceWith("transform", "translate(0,60)");
        });
      });
    });
  });

  describe("on submit", () => {
    let handler, $scope, config;

    beforeEach(
      angular.mock.inject($rootScope => {
        handler = mockChartCompiler.mock.calls[0][2];
        $scope = $rootScope.$new();

        config = handler($scope, initStream);

        config.onSubmit();
      })
    );

    it("should call durationSubmitHandler", () => {
      expect(mockDurationSubmitHandler).toHaveBeenCalledOnceWith("UPDATE_AGENT_VS_COPYTOOL_CHART_ITEMS", {
        page: "base"
      });
    });

    it("should invoke the submit handler", () => {
      expect(submitHandler).toHaveBeenCalledTimes(1);
    });
  });
});
