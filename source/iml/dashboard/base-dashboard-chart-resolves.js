// @flow

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
import * as fp from '@mfl/fp';

import type { HighlandStreamT } from 'highland';

import type { chartT, chartTitleT, chartTitleKeyT } from './dashboard-types.js';

export function baseDashboardChartResolves(
  $stateParams: { id?: string },
  getHostCpuRamChart: chartTitleT,
  getOstBalanceChart: chartT,
  getMdoChart: chartT,
  getReadWriteBandwidthChart: chartT,
  getReadWriteHeatMapChart: chartT,
  getFileUsageChart: chartTitleKeyT,
  getSpaceUsageChart: chartT
) {
  'ngInject';
  const id = $stateParams.id;
  let fsQs = {};

  if (id)
    fsQs = {
      qs: {
        filesystem_id: id
      }
    };

  return Promise.all([
    getReadWriteHeatMapChart(fsQs, id || 'base'),
    getOstBalanceChart(fsQs, id || 'base'),
    getMdoChart(fsQs, id || 'base'),
    getReadWriteBandwidthChart(fsQs, id || 'base'),
    getFileUsageChart('File Usage', 'Files Used', {}, 'fileusagebase'),
    getSpaceUsageChart({}, 'spaceusagebase'),
    getHostCpuRamChart(
      'Metadata Servers',
      angular.merge(
        {
          qs: {
            role: 'MDS'
          }
        },
        fsQs
      ),
      id ? `mds${id}` : 'mdsbase'
    ),
    getHostCpuRamChart(
      'Object Storage Servers',
      angular.merge(
        {
          qs: {
            role: 'OSS'
          }
        },
        fsQs
      ),
      id ? `oss${id}` : 'ossbase'
    )
  ]);
}

export function baseDashboardFsStream(
  fsB: () => HighlandStreamT<Object[]>,
  $stateParams: { id: string }
) {
  'ngInject';
  return broadcaster(fsB().map(fp.filter(x => x.id === $stateParams.id)));
}
