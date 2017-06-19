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

import sortableModule from '../sortable/sortable-module';
import fullScreenModule from '../full-screen/full-screen-module';
import extendScopeModule from '../extend-scope-module';
import hostCpuRamChartModule from '../host-cpu-ram-chart/host-cpu-ram-chart-module';
import mdoModule from '../mdo/mdo-module';
import cpuUsageModule from '../cpu-usage/cpu-usage-module';
import memoryUsageModule from '../memory-usage/memory-usage-module';
import fileUsageModule from '../file-usage/file-usage-module';
import spaceUsageModule from '../space-usage/space-usage-module';
import ostBalanceModule from '../ost-balance/ost-balance-module';
import readWriteBandwidthModule from '../read-write-bandwidth/read-write-bandwidth-module';
import readWriteHeatMapModule from '../read-write-heat-map/read-write-heat-map-module';
import chartCompilerModule from '../chart-compiler/chart-compiler-module';
import { chartsContainer } from './charts-container-directive';
import DashboardCtrl from './dashboard-controller';
import {
  usageInfoDirective,
  UsageInfoController
} from './usage-info/usage-info';

export type filesystemQueryT = {
  qs: {
    filesystem_id: number
  }
};

export type targetQueryT = {
  qs: {
    id: number
  }
};

export default angular
  .module('dashboard', [
    sortableModule,
    fullScreenModule,
    extendScopeModule,
    hostCpuRamChartModule,
    mdoModule,
    cpuUsageModule,
    memoryUsageModule,
    fileUsageModule,
    spaceUsageModule,
    ostBalanceModule,
    readWriteBandwidthModule,
    readWriteHeatMapModule,
    chartCompilerModule
  ])
  .directive('chartsContainer', chartsContainer)
  .controller('DashboardCtrl', DashboardCtrl)
  .directive('usageInfo', usageInfoDirective)
  .controller('UsageInfoController', UsageInfoController).name;
