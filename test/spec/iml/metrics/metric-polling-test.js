import { streamToPromise } from "../../../../source/iml/promise-transforms.js";

describe("polling metrics from filesystem", () => {
  let data, metric$, metricPoll, mockGlobal, mockEnvironment;

  beforeEach(() => {
    data = {
      "1": [
        {
          data: {
            client_count: 0,
            filesfree: 3275995,
            filestotal: 3276800,
            kbytesavail: 3194296,
            kbytesfree: 5544860,
            kbytestotal: 7736392,
            num_exports: 2,
            stats_close: 3,
            stats_create: 4,
            stats_get_info: 3,
            stats_getattr: 9,
            stats_getxattr: 2,
            stats_ldlm_ibits_enqueue: 14,
            stats_mds_connect: 1100264,
            stats_mds_disconnect: 15813,
            stats_mds_get_root: 30,
            stats_mds_getattr: 140,
            stats_mds_reint_open: 3,
            stats_mds_statfs: 180,
            stats_mknod: 2,
            stats_obd_ping: 3701378,
            stats_open: 3,
            stats_read_bytes: 1073741824,
            stats_read_iops: 256,
            stats_req_active: 54928,
            stats_req_qdepth: 54928,
            stats_req_timeout: 73756,
            stats_req_waittime: 13469486,
            stats_reqbuf_avail: 9355970,
            stats_set_info: 12,
            stats_statfs: 127656,
            stats_write_bytes: 2147483648,
            stats_write_iops: 514,
            tot_dirty: 0,
            tot_granted: 558208,
            tot_pending: 0
          },
          ts: "2019-11-05T20:08:50+00:00"
        },
        {
          data: {
            client_count: 0,
            filesfree: 3275995,
            filestotal: 3276800,
            kbytesavail: 3194296,
            kbytesfree: 5544860,
            kbytestotal: 7736392,
            num_exports: 2,
            stats_close: 3,
            stats_create: 4,
            stats_get_info: 3,
            stats_getattr: 9,
            stats_getxattr: 2,
            stats_ldlm_ibits_enqueue: 14,
            stats_mds_connect: 1100264,
            stats_mds_disconnect: 15813,
            stats_mds_get_root: 30,
            stats_mds_getattr: 140,
            stats_mds_reint_open: 3,
            stats_mds_statfs: 180,
            stats_mknod: 2,
            stats_obd_ping: 3701378,
            stats_open: 3,
            stats_read_bytes: 1073741824,
            stats_read_iops: 256,
            stats_req_active: 54928,
            stats_req_qdepth: 54928,
            stats_req_timeout: 73756,
            stats_req_waittime: 13469486,
            stats_reqbuf_avail: 9355970,
            stats_set_info: 12,
            stats_statfs: 127656,
            stats_write_bytes: 2147483648,
            stats_write_iops: 514,
            tot_dirty: 0,
            tot_granted: 558208,
            tot_pending: 0
          },
          ts: "2019-11-05T20:09:00+00:00"
        }
      ],
      "2": [
        {
          data: {
            client_count: 2,
            filesfree: 5897048,
            filestotal: 5898240,
            kbytesavail: 5291184,
            kbytesfree: 9435328,
            kbytestotal: 9556360,
            num_exports: 4,
            stats_close: 0,
            stats_create: 8,
            stats_get_info: 4,
            stats_getattr: 3,
            stats_getxattr: 0,
            stats_ldlm_ibits_enqueue: 15,
            stats_mds_connect: 2125720,
            stats_mds_disconnect: 16098,
            stats_mds_get_root: 90,
            stats_mds_getattr: 264,
            stats_mds_reint_open: 3,
            stats_mds_statfs: 246,
            stats_mknod: 0,
            stats_obd_ping: 3707352,
            stats_open: 0,
            stats_read_bytes: 0,
            stats_read_iops: 0,
            stats_req_active: 55084,
            stats_req_qdepth: 55084,
            stats_req_timeout: 73930,
            stats_req_waittime: 13489856,
            stats_reqbuf_avail: 9380610,
            stats_set_info: 0,
            stats_statfs: 1035,
            stats_write_bytes: 0,
            stats_write_iops: 0,
            tot_dirty: 0,
            tot_granted: 556416,
            tot_pending: 0
          },
          ts: "2019-11-05T20:08:50+00:00"
        },
        {
          data: {
            client_count: 2,
            filesfree: 5897048,
            filestotal: 5898240,
            kbytesavail: 5291184,
            kbytesfree: 9435328,
            kbytestotal: 9556360,
            num_exports: 4,
            stats_close: 0,
            stats_create: 8,
            stats_get_info: 4,
            stats_getattr: 3,
            stats_getxattr: 0,
            stats_ldlm_ibits_enqueue: 15,
            stats_mds_connect: 2125720,
            stats_mds_disconnect: 16098,
            stats_mds_get_root: 90,
            stats_mds_getattr: 264,
            stats_mds_reint_open: 3,
            stats_mds_statfs: 246,
            stats_mknod: 0,
            stats_obd_ping: 3707352,
            stats_open: 0,
            stats_read_bytes: 0,
            stats_read_iops: 0,
            stats_req_active: 55084,
            stats_req_qdepth: 55084,
            stats_req_timeout: 73930,
            stats_req_waittime: 13489856,
            stats_reqbuf_avail: 9380610,
            stats_set_info: 0,
            stats_statfs: 1035,
            stats_write_bytes: 0,
            stats_write_iops: 0,
            tot_dirty: 0,
            tot_granted: 556416,
            tot_pending: 0
          },
          ts: "2019-11-05T20:09:00+00:00"
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
      metric$ = await metricPoll();
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
      metric$ = await metricPoll();
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
      metric$ = await metricPoll();
      const transformedData = await streamToPromise(metric$);
      expect(transformedData).toMatchSnapshot();
    });
  });

  describe("with a single entry for the filesystem", () => {
    beforeEach(() => {
      mockGlobal.fetch.mockImplementation(() => ({
        json: () => ({
          "1": [{ ...data["1"][0] }]
        })
      }));
    });

    it("should extract the metric data", async () => {
      metric$ = await metricPoll();
      const transformedData = await streamToPromise(metric$);
      expect(transformedData).toMatchSnapshot();
    });
  });
});
