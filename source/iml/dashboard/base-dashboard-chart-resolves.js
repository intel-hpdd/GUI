//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import angular from 'angular';
import broadcaster from '../broadcaster.js';
import resolveStream from '../resolve-stream.js';
import socketStream from '../socket/socket-stream.js';

import {
  lensProp,
  view
} from 'intel-fp';

import type {
  getMdoChartT
} from '../mdo/mdo-module.js';

import type {
  getReadWriteHeatMapChartT
} from '../read-write-heat-map/read-write-heat-map-module.js';


export function baseDashboardChartResolvesFactory ($route, getHostCpuRamChart, getOstBalanceChart,
                                                getMdoChart:getMdoChartT, getReadWriteBandwidthChart,
                                                getReadWriteHeatMapChart:getReadWriteHeatMapChartT, $q) {
  'ngInject';

  return function baseDashboardChart () {
    var fsId = $route.current.params.fsId;
    var fsQs = {};

    if (fsId)
      fsQs = {
        qs: {
          filesystem_id: fsId
        }
      };

    return $q.all([
      getReadWriteHeatMapChart(fsQs, fsId || 'base'),
      getOstBalanceChart(fsQs, fsId || 'base'),
      getMdoChart(fsQs, fsId || 'base'),
      getReadWriteBandwidthChart(fsQs, fsId || 'base'),
      getHostCpuRamChart('Metadata Servers', angular.merge({
        qs: {
          role: 'MDS'
        }
      }, fsQs), fsId ? (`mds${fsId}`) : 'mdsbase'),
      getHostCpuRamChart('Object Storage Servers', angular.merge({
        qs: {
          role: 'OSS'
        }
      }, fsQs), fsId ? (`oss${fsId}`) : 'ossbase')
    ]);
  };
}

export function baseDashboardFsStreamFactory ($route) {
  'ngInject';

  return function baseDashboardFsStream () {
    var fsId = $route.current.params.fsId;
    var qs = {};

    if (fsId)
      qs = {
        id: $route.current.params.fsId
      };

    const pluckObjects = view(lensProp('objects'));

    const s = socketStream('/filesystem', {
      jsonMask: 'objects(name,bytes_total,bytes_free,files_free,files_total,client_count,immutable_state,\
id,osts,mdts(id),mgt(primary_server,primary_server_name)',
      qs
    })
    .map(pluckObjects);

    return resolveStream(s)
      .then(broadcaster);
  };
}
