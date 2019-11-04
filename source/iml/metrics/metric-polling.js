// @flow
//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from "highland";
import { API } from "../environment.js";

type MdtMetricDataT = {|
  client_count: Number,
  filesfree: Number,
  filestotal: Number,
  kbytesfree: Number,
  kbytestotal: Number,
  stats_close: Number,
  stats_getattr: Number,
  stats_getxattr: Number,
  stats_ldlm_ibits_enqueue: Number,
  stats_mds_connect: Number,
  stats_mds_disconnect: Number,
  stats_mds_get_root: Number,
  stats_mds_getattr: Number,
  stats_mds_reint_open: Number,
  stats_mds_statfs: Number,
  stats_mknod: Number,
  stats_obd_ping: Number,
  stats_open: Number,
  stats_req_active: Number,
  stats_req_qdepth: Number,
  stats_req_timeout: Number,
  stats_req_waittime: Number,
  stats_reqbuf_avail: Number,
  stats_statfs: Number
|};

type OstMetricDataT = {|
  filesfree: Number,
  filestotal: Number,
  kbytesavail: Number,
  kbytesfree: Number,
  kbytestotal: Number,
  num_exports: Number,
  stats_create: Number,
  stats_get_info: Number,
  stats_read_bytes: Number,
  stats_read_iops: Number,
  stats_set_info: Number,
  stats_statfs: Number,
  stats_write_bytes: Number,
  stats_write_iops: Number,
  tot_dirty: Number,
  tot_granted: Number,
  tot_pending: Number
|};

type MetricDataT = {
  [key: String]: [
    {
      data: MdtMetricDataT | OstMetricDataT,
      ts: String
    }
  ]
};

export const metricPoll = () => {
  const s$ = highland(async (push, next) => {
    try {
      const r = await fetch(`${API}target/metric?latest=true`);
      const data: MetricDataT = await r.json();

      const newData = Object.entries(data).reduce((acc, [id, curData]) => {
        const metricData = curData.map(x => ({
          kbytesfree: x.data.kbytesfree || 0,
          kbytestotal: x.data.kbytestotal || 0,
          filesfree: x.data.filesfree || 0,
          filestotal: x.data.filestotal || 0,
          client_count: x.data.client_count || 0
        }));

        acc[id] = metricData[0];
        return acc;
      }, {});

      push(null, newData);
      setTimeout(() => next(), 10000);
    } catch (err) {
      push(err);
    }
  });

  return s$;
};
