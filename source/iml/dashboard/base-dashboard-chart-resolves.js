// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { chartT, chartTitleT, chartTitleKeyT } from './dashboard-types.js';

import angular from 'angular';

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
