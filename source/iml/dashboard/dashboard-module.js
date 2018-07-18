// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

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
import { usageInfoDirective, UsageInfoController } from './usage-info/usage-info';

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
