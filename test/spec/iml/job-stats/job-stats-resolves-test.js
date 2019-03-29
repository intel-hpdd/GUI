import highland from "highland";
import { streamToPromise } from "../../../../source/iml/promise-transforms.js";

describe("jobstats resolves", () => {
  let jobstats$, getData, mockTopDuration, mockTopRange, mockStore;

  beforeEach(() => {
    mockTopDuration = jest.fn(() => highland(["topDuration"]));

    mockTopRange = jest.fn(() => highland(["topRange"]));

    mockStore = {
      select: jest.fn(name => {
        if (name === "targets")
          return highland([
            [
              {
                id: 1,
                name: "foo"
              }
            ]
          ]);
        else if (name === "jobStatsConfig")
          return highland([
            {
              duration: 5
            }
          ]);
      })
    };

    jest.mock("../../../../source/iml/job-stats/job-stats-top-stream.js", () => ({
      topDuration: mockTopDuration,
      topRange: mockTopRange
    }));

    jest.mock("../../../../source/iml/store/get-store.js", () => mockStore);

    jest.mock("../../../../node_modules/moment/moment.js", () => x => ({
      format: () => x
    }));

    const mod = require("../../../../source/iml/job-stats/job-stats-resolves.js");

    ({ jobstats$, getData } = mod);
  });

  describe("jobstats$", () => {
    it("should select duration when there is no id prop", async () => {
      await jobstats$({});

      expect(mockTopDuration).toHaveBeenCalledOnceWith(5);
    });

    it("should return duration info if there is no id prop", async () => {
      const result = await jobstats$({}).then(streamToPromise);

      expect(result).toBe("topDuration");
    });

    it("should select range when there is an id prop", () => {
      jobstats$({
        id: "1",
        startDate: "2016-08-17T18:34:04.000Z",
        endDate: "2016-08-17T18:34:20.000Z"
      });

      expect(mockTopRange).toHaveBeenCalledOnceWith("2016-08-17T18:34:04.000Z", "2016-08-17T18:34:20.000Z", {
        qs: {
          id: "1"
        }
      });
    });
  });

  describe("getData", () => {
    it("should return an empty object when there is no id prop", () => {
      expect(getData({})).toEqual({});
    });

    it("it should return a label when there is an id prop", async () => {
      const result = await getData({
        id: 1,
        startDate: "2016-08-17T18:34:04.000Z",
        endDate: "2016-08-17T18:34:20.000Z"
      });

      expect(result).toEqual({
        label: "foo (2016-08-17T18:34:04.000Z - 2016-08-17T18:34:20.000Z)"
      });
    });
  });
});
