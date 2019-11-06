//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from "../store/get-store.js";
import broadcaster from "../broadcaster.js";
import { multiStream2 } from "../multi-stream.js";
import { metricPoll } from "../metrics/metric-polling.js";

export const dashboardFsB = async () => {
  return broadcaster(
    multiStream2([store.select("fileSystems").map(Object.values), await metricPoll()]).map(([filesystems, metrics]) => {
      return filesystems.map(fs => {
        if (metrics[fs.id] != null)
          return {
            ...fs,
            ...metrics[fs.id],
            client_count: metrics[fs.id].client_count / fs.mdts.length
          };
        else return fs;
      });
    })
  );
};

export const dashboardHostB = () => {
  return broadcaster(store.select("server").map(Object.values));
};

export const dashboardTargetB = () => {
  return broadcaster(store.select("targets"));
};
