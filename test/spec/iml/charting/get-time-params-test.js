import moment from "moment";
import highland from "highland";
import * as fp from "@iml/fp";

describe("get time params", () => {
  let mockGetServerMoment, mockCreateDate, getRequestRange, getRequestDuration, getTimeParams;

  beforeEach(() => {
    mockGetServerMoment = jest.fn();
    mockCreateDate = jest.fn();

    jest.mock("../../../../source/iml/get-server-moment.js", () => mockGetServerMoment);
    jest.mock("../../../../source/iml/create-date.js", () => mockCreateDate);

    const mod = require("../../../../source/iml/charting/get-time-params.js");

    getRequestRange = mod.getRequestRange;
    getRequestDuration = mod.getRequestDuration;
    getTimeParams = mod.getTimeParams;
  });

  describe("getRequestRange", () => {
    beforeEach(() => {
      mockGetServerMoment.mockImplementation((d, f) => {
        // We always convert local time to utc time
        // implicitly before send.
        // For the purposes of these tests,
        // force to UTC right away
        // so they will run in different time zones.
        return moment.utc(d, f);
      });
    });

    it("should return a function", () => {
      expect(getRequestRange).toEqual(expect.any(Function));
    });

    describe("when invoked", () => {
      let requestRange;

      beforeEach(() => {
        requestRange = getRequestRange({
          qs: {
            id: "4"
          }
        })("2015-04-30T00:00", "2015-05-01T00:00");
      });

      it("should return a function", () => {
        expect(requestRange).toEqual(expect.any(Function));
      });

      it("should return a setLatest method", () => {
        expect(requestRange.setLatest).toEqual(expect.any(Function));
      });

      it("should set the range on params", () => {
        const params = { qs: {} };

        expect(requestRange(params)).toEqual({
          qs: {
            id: "4",
            begin: "2015-04-30T00:00:00.000Z",
            end: "2015-05-01T00:00:00.000Z"
          }
        });
      });

      it("should clone the params", () => {
        const params = { qs: {} };

        expect(requestRange(params)).not.toBe(params);
      });
    });
  });

  describe("getRequestDuration", () => {
    beforeEach(() => {
      mockGetServerMoment.mockImplementation(() => {
        // We always convert local time to utc time
        // implicitly before send.
        // For the purposes of these tests,
        // force to UTC right away
        // so they will run in different time zones.
        return moment.utc("2015-04-30T00:00:00.000Z");
      });

      mockCreateDate.mockImplementation(d => {
        if (!d) d = "2015-04-30T00:00:10.000Z";

        return new Date(d);
      });
    });

    it("should return a function", () => {
      expect(getRequestDuration).toEqual(expect.any(Function));
    });

    describe("invoking", () => {
      let requestDuration;

      beforeEach(() => {
        requestDuration = getRequestDuration({
          qs: {
            id: "3"
          }
        })(10, "minutes");
      });

      it("should return a function", () => {
        expect(requestDuration).toEqual(expect.any(Function));
      });

      it("should set begin and end params", () => {
        const params = { qs: {} };

        expect(requestDuration(params)).toEqual({
          qs: {
            id: "3",
            begin: "2015-04-29T23:49:50.000Z",
            end: "2015-04-30T00:00:10.000Z"
          }
        });
      });

      it("should clone the params", () => {
        const params = { qs: {} };

        expect(requestDuration(params)).not.toEqual(params);
      });

      it("should update when latest is set", () => {
        const params = { qs: {} };

        highland([{ ts: "2015-04-30T00:00:00.000Z" }])
          .through(requestDuration.setLatest)
          .each(fp.noop);

        expect(requestDuration(params)).toEqual({
          qs: {
            id: "3",
            begin: "2015-04-30T00:00:10.000Z",
            end: "2015-04-30T00:00:00.000Z",
            update: true
          }
        });
      });
    });
  });

  describe("getTimeParams", () => {
    it("should return time param functions", () => {
      expect(getTimeParams).toEqual({
        getRequestDuration: expect.any(Function),
        getRequestRange: expect.any(Function)
      });
    });
  });
});
