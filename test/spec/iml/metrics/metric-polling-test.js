import { streamToPromise } from "../../../../source/iml/promise-transforms.js";

describe("polling metrics from filesystem", () => {
  let data, metric$, metricPoll, mockGlobal, mockEnvironment;

  beforeEach(() => {
    data = {
      "1": [
        {
          data: {
            client_count: 1,
            filesfree: 3275995,
            filestotal: 3276800,
            kbytesavail: 3194296,
            kbytesfree: 5544860,
            kbytestotal: 7736392,
            num_exports: 2,
            stats_close: 3,
            stats_create: 4,
            stats_get_info: 3,
            stats_getattr: 8,
            stats_getxattr: 2,
            stats_ldlm_ibits_enqueue: 13,
            stats_mds_connect: 1077261,
            stats_mds_disconnect: 329,
            stats_mds_get_root: 30,
            stats_mds_getattr: 140,
            stats_mds_reint_open: 3,
            stats_mds_statfs: 180,
            stats_mknod: 2,
            stats_obd_ping: 2786801,
            stats_open: 3,
            stats_read_bytes: 1073741824,
            stats_read_iops: 256,
            stats_req_active: 41606,
            stats_req_qdepth: 41606,
            stats_req_timeout: 57854,
            stats_req_waittime: 10408033,
            stats_reqbuf_avail: 7016704,
            stats_set_info: 12,
            stats_statfs: 104383,
            stats_write_bytes: 2147483648,
            stats_write_iops: 514,
            tot_dirty: 0,
            tot_granted: 558208,
            tot_pending: 0
          },
          ts: "2019-11-04T21:04:20+00:00"
        }
      ],
      "2": [
        {
          data: {
            client_count: 0,
            filesfree: 3275997,
            filestotal: 3276800,
            kbytesavail: 5291456,
            kbytesfree: 7642024,
            kbytestotal: 7736392,
            num_exports: 2,
            stats_close: 0,
            stats_create: 4,
            stats_get_info: 2,
            stats_getattr: 0,
            stats_getxattr: 0,
            stats_ldlm_ibits_enqueue: 0,
            stats_mds_connect: 11821,
            stats_mds_disconnect: 266,
            stats_mds_get_root: 0,
            stats_mds_getattr: 0,
            stats_mds_reint_open: 0,
            stats_mds_statfs: 0,
            stats_mknod: 0,
            stats_obd_ping: 36760,
            stats_open: 0,
            stats_read_bytes: 0,
            stats_read_iops: 0,
            stats_req_active: 739,
            stats_req_qdepth: 739,
            stats_req_timeout: 757,
            stats_req_waittime: 101370,
            stats_reqbuf_avail: 125694,
            stats_set_info: 0,
            stats_statfs: 2450,
            stats_write_bytes: 0,
            stats_write_iops: 0,
            tot_dirty: 0,
            tot_granted: 558208,
            tot_pending: 0
          },
          ts: "2019-11-04T21:04:20+00:00"
        }
      ]
    };

    mockGlobal = {
      fetch: jest.fn()
    };
    jest.mock("../../../../source/iml/global.js", () => mockGlobal);

    mockEnvironment = {
      API: "https://localhost:443/api/"
    };
    jest.mock("../../../../source/iml/environment.js", () => mockEnvironment);

    metricPoll = require("../../../../source/iml/metrics/metric-polling.js").metricPoll;
  });

  describe("with data", () => {
    beforeEach(() => {
      mockGlobal.fetch.mockImplementation(() => ({
        json: () => data
      }));
    });

    it("should extract the metric data", async () => {
      metric$ = metricPoll();
      const transformedData = await streamToPromise(metric$);
      expect(transformedData).toMatchSnapshot();
    });
  });

  describe("without data", () => {
    beforeEach(() => {
      mockGlobal.fetch.mockImplementation(() => ({
        json: () => ({
          "1": [{ data: {}, ts: "" }],
          "2": [{ data: { ...data["2"][0].data }, ts: "" }]
        })
      }));
    });

    it("should extract the metric data", async () => {
      metric$ = metricPoll();
      const transformedData = await streamToPromise(metric$);
      expect(transformedData).toMatchSnapshot();
    });
  });

  describe("with missing data", () => {
    beforeEach(() => {
      mockGlobal.fetch.mockImplementation(() => ({
        json: () => ({
          "1": [
            {
              data: {
                client_count: 1,
                filesfree: 3275995,
                kbytesavail: 3194296,
                kbytesfree: 5544860
              },
              ts: ""
            }
          ],
          "2": [{ data: { ...data["2"][0].data }, ts: "" }]
        })
      }));
    });

    it("should extract the metric data", async () => {
      metric$ = metricPoll();
      const transformedData = await streamToPromise(metric$);
      expect(transformedData).toMatchSnapshot();
    });
  });
});
