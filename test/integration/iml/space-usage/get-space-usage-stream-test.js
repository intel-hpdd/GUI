import highland from "highland";
import moment from "moment";
import { getRequestDuration } from "../../../../source/iml/charting/get-time-params.js";
import { convertNvDates } from "../../../test-utils.js";

import fixtures from "../../../data-fixtures/space-usage-fixtures.json";

describe("space usage stream", () => {
  let mockSocketStream, bufferDataNewerThan, getSpaceUsageStream, endAndRunTimers, spy;

  beforeEach(() => {
    const mockCreateMoment = () => moment("2014-04-14T13:12:00+00:00");

    jest.mock("../../../../source/iml/get-server-moment.js", () => mockCreateMoment);

    const mockCreateStream = () => {
      mockSocketStream = highland();

      endAndRunTimers = x => {
        mockSocketStream.write(x);
        mockSocketStream.end();
        jest.runAllTimers();
      };

      return mockSocketStream;
    };

    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockCreateStream);

    bufferDataNewerThan = require("../../../../source/iml/charting/buffer-data-newer-than.js").default;

    getSpaceUsageStream = require("../../../../source/iml/space-usage/get-space-usage-stream.js").default;

    spy = jest.fn();

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("should return a factory function", () => {
    expect(getSpaceUsageStream).toEqual(expect.any(Function));
  });

  describe("fetching 10 minutes ago", () => {
    let spaceUsageStream;

    beforeEach(() => {
      const buff = bufferDataNewerThan(10, "minutes");
      const requestDuration = getRequestDuration({}, 10)("minutes");

      spaceUsageStream = getSpaceUsageStream(requestDuration, buff);

      spaceUsageStream.through(convertNvDates).each(spy);
    });

    describe("when there is data", () => {
      beforeEach(() => {
        endAndRunTimers(fixtures[0].in);
      });

      it("should return a stream", () => {
        expect(highland.isStream(spaceUsageStream)).toBe(true);
      });

      it("should return computed data", () => {
        expect(spy).toHaveBeenCalledOnceWith(fixtures[0].out);
      });

      it("should drop duplicate values", () => {
        endAndRunTimers(fixtures[0].in[0]);
        expect(spy).toHaveBeenCalledTwiceWith(fixtures[0].out);
      });
    });

    describe("when there is no initial data", () => {
      beforeEach(() => {
        endAndRunTimers([]);
      });

      it("should return an empty nvd3 structure", () => {
        expect(spy).toHaveBeenCalledOnceWith([
          {
            key: "Space Used",
            values: []
          }
        ]);
      });

      it("should populate if data comes in on next tick", () => {
        endAndRunTimers(fixtures[0].in[0]);

        expect(spy).toHaveBeenCalledOnceWith([
          {
            key: "Space Used",
            values: [
              {
                x: "2014-04-14T13:11:50.000Z",
                y: 0.6627046805673511
              }
            ]
          }
        ]);
      });
    });
  });
});
