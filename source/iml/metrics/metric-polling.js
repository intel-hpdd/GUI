// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from "highland";
import global from "../global.js";
import { API } from "../environment.js";

export const metricPoll = () => {
  const s$ = highland(async (push, next) => {
    try {
      const r = await global.fetch(`${API}target/metric?latest=true&group_by=filesystem&reduce_fn=sum`);
      const data = await r.json();

      const newData = Object.entries(data).reduce((acc, [id, curData]) => {
        const metricData = curData.map(x => ({
          bytes_free: x.data && x.data.kbytesfree && x.data.kbytesfree * 1024,
          bytes_total: x.data && x.data.kbytestotal && x.data.kbytestotal * 1024,
          files_free: x.data && x.data.filesfree && x.data.filesfree * 1024,
          files_total: x.data && x.data.filestotal && x.data.filestotal * 1024,
          client_count: x.data && x.data.client_count
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
