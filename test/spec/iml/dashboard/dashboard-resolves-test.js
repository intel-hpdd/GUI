import highland from "highland";
import { streamToPromise } from "../../../../source/iml/promise-transforms.js";

describe("dashboard resolves", () => {
  let s, spy, mockStore, mockBroadcaster, mockMetricPolling, mod;

  beforeEach(() => {
    spy = jest.fn();
    s = highland();

    mockBroadcaster = jest.fn(x => () => x);

    mockStore = {
      select: jest.fn(() => s)
    };

    jest.mock("../../../../source/iml/store/get-store.js", () => mockStore);
    jest.mock("../../../../source/iml/broadcaster.js", () => mockBroadcaster);

    mockMetricPolling = {
      metricPoll: jest.fn(() => {
        return highland([
          {
            1: {
              bytes_free: 3841384448,
              bytes_total: 6058418176,
              files_free: 2621169,
              files_total: 2621440,
              client_count: 6
            },
            2: {
              bytes_free: 1753678638,
              bytes_total: 4163518176,
              files_free: 3225169,
              files_total: 7251340,
              client_count: 2
            }
          }
        ]);
      })
    };
    jest.mock("../../../../source/iml/metrics/metric-polling.js", () => mockMetricPolling);

    mod = require("../../../../source/iml/dashboard/dashboard-resolves.js");
  });

  describe("fs stream", () => {
    let fsStream;

    beforeEach(async () => {
      fsStream = (await mod.dashboardFsB())();
    });

    it("should be a broadcaster", () => {
      expect(mockBroadcaster).toHaveBeenCalledTimes(1);
    });

    it("should select from the store", () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith("fileSystems");
    });

    it("should stream data", () => {
      s.write(["foo"]);

      fsStream.each(spy);

      expect(spy).toHaveBeenCalledOnceWith(["foo"]);
    });

    it("should invoke the metric poll stream", () => {
      expect(mockMetricPolling.metricPoll).toHaveBeenCalledTimes(1);
    });

    it("should join the data", async () => {
      s.write([{ id: 1, mdts: [1, 2, 3] }, { id: 2, mdts: [1, 2] }]);

      const data = await streamToPromise(fsStream);

      expect(data).toMatchSnapshot();
    });
  });

  describe("host stream", () => {
    let hostStream;

    beforeEach(() => {
      hostStream = mod.dashboardHostB()();
    });

    it("should be a broadcaster", () => {
      expect(mockBroadcaster).toHaveBeenCalledTimes(1);
    });

    it("should select from the store", () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith("server");
    });

    it("should stream data", () => {
      s.write(["foo"]);

      hostStream.each(spy);

      expect(spy).toHaveBeenCalledOnceWith(["foo"]);
    });
  });

  describe("target stream", () => {
    let targetStream;

    beforeEach(() => {
      targetStream = mod.dashboardTargetB()();
    });

    it("should be a broadcaster", () => {
      expect(mockBroadcaster).toHaveBeenCalledTimes(1);
    });

    it("should select from the store", () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith("targets");
    });

    it("should stream data", () => {
      s.write(["foo"]);

      targetStream.each(spy);

      expect(spy).toHaveBeenCalledOnceWith(["foo"]);
    });
  });
});
