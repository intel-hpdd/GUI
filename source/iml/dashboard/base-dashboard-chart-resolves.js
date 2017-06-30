// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import broadcaster from '../broadcaster.js';
import * as fp from '@iml/fp';

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
