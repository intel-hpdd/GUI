import {
  UPDATE_READ_WRITE_BANDWIDTH_CHART_ITEMS,
  DEFAULT_READ_WRITE_BANDWIDTH_CHART_ITEMS,
  default as readWriteBandwidthChartReducer
} from "../../../../source/iml/read-write-bandwidth/read-write-bandwidth-chart-reducer.js";
import deepFreeze from "@iml/deep-freeze";

describe("Read Write Bandwidth reducer", () => {
  it("should be a function", () => {
    expect(readWriteBandwidthChartReducer).toEqual(expect.any(Function));
  });

  describe("matching type", () => {
    describe("DEFAULT case", () => {
      describe("without page data", () => {
        it("should write the intial payload for the page", () => {
          expect(
            readWriteBandwidthChartReducer(
              {
                base: {
                  configType: "duration",
                  startDate: "startDate",
                  endDate: "endDate",
                  size: 3,
                  unit: "hours",
                  page: "base"
                }
              },
              {
                type: DEFAULT_READ_WRITE_BANDWIDTH_CHART_ITEMS,
                payload: {
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
              configType: "duration",
              startDate: "startDate",
              endDate: "endDate",
              size: 3,
              unit: "hours",
              page: "base"
            },
            fs1: {
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
            readWriteBandwidthChartReducer(
              {
                base: {
                  configType: "duration",
                  startDate: "startDate",
                  endDate: "endDate",
                  size: 3,
                  unit: "hours",
                  page: "base"
                }
              },
              {
                type: DEFAULT_READ_WRITE_BANDWIDTH_CHART_ITEMS,
                payload: {
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
          readWriteBandwidthChartReducer(
            {
              "": {
                configType: "range",
                startDate: "startDate",
                endDate: "endDate",
                size: 10,
                unit: "minutes",
                page: ""
              },
              target8: {
                configType: "duration",
                startDate: "startDate",
                endDate: "endDate",
                size: 3,
                unit: "hours",
                page: "target8"
              }
            },
            {
              type: UPDATE_READ_WRITE_BANDWIDTH_CHART_ITEMS,
              payload: {
                configType: "duration",
                size: 15,
                unit: "minutes",
                page: "target8"
              }
            }
          )
        ).toEqual({
          "": {
            configType: "range",
            startDate: "startDate",
            endDate: "endDate",
            size: 10,
            unit: "minutes",
            page: ""
          },
          target8: {
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
        readWriteBandwidthChartReducer(deepFreeze([]), {
          type: "ADD_ALERT_INDICATOR_ITEMS",
          payload: { key: "val" }
        })
      ).toEqual([]);
    });
  });
});
