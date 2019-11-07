// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from "highland";
import global from "../global.js";
import { API } from "../environment.js";

const METRIC_ENDPOINT = `${API}target/metric/?latest=true&group_by=filesystem&reduce_fn=sum`;

const transformMetricData = (acc, [id, curData]) => {
  const x = curData
    .map(x => ({
      ...x,
      ts: new Date(x.ts)
    }))
    .sort((a, b) => {
      return b.ts - a.ts;
    })[0].data;

  const metricData = {
    bytes_free: x && x.kbytesfree && x.kbytesfree * 1024,
    bytes_total: x && x.kbytestotal && x.kbytestotal * 1024,
    files_free: x && x.filesfree && x.filesfree * 1024,
    files_total: x && x.filestotal && x.filestotal * 1024,
    client_count: x && x.client_count
  };

  acc[id] = metricData;
  return acc;
};

export const metricPoll = async () => {
  try {
    const r = await global.fetch(METRIC_ENDPOINT);
    const data = await r.json();

    const initialData = Object.entries(data).reduce(transformMetricData, {});

    const s$ = highland(async (push, next) => {
      try {
        const r = await global.fetch(METRIC_ENDPOINT);
        const data = await r.json();

        const newData = Object.entries(data).reduce(transformMetricData, {});

        push(null, newData);
        setTimeout(() => next(), 10000);
      } catch (err) {
        push(err);
      }
    });

    s$.write(initialData);

    return s$;
  } catch (e) {
    console.error("Received error when attempting to fetch target metrics: ", e);
    return highland([]);
  }
};
