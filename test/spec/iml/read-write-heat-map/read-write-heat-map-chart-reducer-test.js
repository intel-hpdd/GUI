import {
  UPDATE_READ_WRITE_HEAT_MAP_CHART_ITEMS,
  DEFAULT_READ_WRITE_HEAT_MAP_CHART_ITEMS,
  default as readWriteHeatMapChartReducer
} from "../../../../source/iml/read-write-heat-map/read-write-heat-map-chart-reducer.js";
import deepFreeze from "@iml/deep-freeze";

describe("read write heat map reducer", () => {
  it("should be a function", () => {
    expect(readWriteHeatMapChartReducer).toEqual(expect.any(Function));
  });

  describe("matching type", () => {
    describe("DEFAULT case", () => {
      describe("without page data", () => {
        it("should write the intial payload for the page", () => {
          expect(
            readWriteHeatMapChartReducer(
              {
                base: {
                  dataType: "dataType",
                  configType: "duration",
                  startDate: "startDate",
                  endDate: "endDate",
                  size: 3,
                  unit: "hours",
                  page: "base"
                }
              },
              {
                type: DEFAULT_READ_WRITE_HEAT_MAP_CHART_ITEMS,
                payload: {
                  dataType: "dataType",
                  configType: "duration",
                  startDate: "startDate",
                  endDate: "endDate",
                  size: 15,
                  unit: "minutes",
                  page: "fs1"
                }
              }
            )
          ).toEqual({
            base: {
              dataType: "dataType",
              configType: "duration",
              startDate: "startDate",
              endDate: "endDate",
              size: 3,
              unit: "hours",
              page: "base"
            },
            fs1: {
              dataType: "dataType",
              configType: "duration",
              startDate: "startDate",
              endDate: "endDate",
              size: 15,
              unit: "minutes",
              page: "fs1"
            }
          });
        });
      });

      describe("with page data", () => {
        it("should NOT write the payload for the page", () => {
          expect(
            readWriteHeatMapChartReducer(
              {
                base: {
                  dataType: "dataType",
                  configType: "duration",
                  startDate: "startDate",
                  endDate: "endDate",
                  size: 3,
                  unit: "hours",
                  page: "base"
                }
              },
              {
                type: DEFAULT_READ_WRITE_HEAT_MAP_CHART_ITEMS,
                payload: {
                  dataType: "dataType",
                  configType: "duration",
                  startDate: "startDate",
                  endDate: "endDate",
                  size: 15,
                  unit: "minutes",
                  page: "base"
                }
              }
            )
          ).toEqual({
            base: {
              dataType: "dataType",
              configType: "duration",
              startDate: "startDate",
              endDate: "endDate",
              size: 3,
              unit: "hours",
              page: "base"
            }
          });
        });
      });
    });

    describe("UPDATE case", () => {
      it("should update the state", () => {
        expect(
          readWriteHeatMapChartReducer(
            {
              "": {
                dataType: "dataType",
                configType: "range",
                startDate: "startDate",
                endDate: "endDate",
                size: 10,
                unit: "minutes",
                page: ""
              },
              target8: {
                dataType: "dataType",
                configType: "duration",
                startDate: "startDate",
                endDate: "endDate",
                size: 3,
                unit: "hours",
                page: "target8"
              }
            },
            {
              type: UPDATE_READ_WRITE_HEAT_MAP_CHART_ITEMS,
              payload: {
                dataType: "dataType",
                configType: "duration",
                size: 15,
                unit: "minutes",
                page: "target8"
              }
            }
          )
        ).toEqual({
          "": {
            dataType: "dataType",
            configType: "range",
            startDate: "startDate",
            endDate: "endDate",
            size: 10,
            unit: "minutes",
            page: ""
          },
          target8: {
            dataType: "dataType",
            configType: "duration",
            startDate: "startDate",
            endDate: "endDate",
            size: 15,
            unit: "minutes",
            page: "target8"
          }
        });
      });
    });
  });

  describe("non-matching type", () => {
    it("should return the state", () => {
      expect(
        readWriteHeatMapChartReducer(deepFreeze([]), {
          type: "ADD_ALERT_INDICATOR_ITEMS",
          payload: { key: "val" }
        })
      ).toEqual([]);
    });
  });
});
