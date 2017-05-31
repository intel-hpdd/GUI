//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import socketStream from '../socket/socket-stream.js';

import {
  flow,
  map,
  lensProp,
  view
} from 'intel-fp';

export default function getCopytoolOperationStream (params) {
  params = angular.merge({}, {
    jsonMask: 'objects(id,copytool/host/label,processed_bytes,total_bytes,\
updated_at,started_at,throughput,type,state,path,description)',
    qs: {
      active: true,
      limit: 0
    }
  }, params || {});

  const buildProgress = map(function buildProgress (item) {
    const progress = item.processed_bytes / item.total_bytes * 100;

    item.progress = isFinite(progress) ? progress : 0;

    return item;
  });

  const buildThroughput = map(function buildThroughput (item) {
    var elapsed = (Date.parse(item.updated_at) - Date.parse(item.started_at)) / 1000;

    if (elapsed < 1 || !isFinite(elapsed)) {
      item.throughput = 0;
    } else {
      // bytes/sec
      var throughput = item.processed_bytes / elapsed;
      item.throughput = isFinite(throughput) ? throughput : 0;
    }

    return item;
  });

  const addMetrics = map(
    flow(
      view(lensProp('objects')),
      buildProgress,
      buildThroughput
    )
  );

  return socketStream('/copytool_operation', params)
    .through(addMetrics);
}
