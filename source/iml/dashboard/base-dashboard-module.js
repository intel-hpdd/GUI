// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import extendScopeModule from '../extend-scope-module';
import hostCpuRamChartModule
  from '../host-cpu-ram-chart/host-cpu-ram-chart-module';
import readWriteBandwidthModule
  from '../read-write-bandwidth/read-write-bandwidth-module';
import mdoModule from '../mdo/mdo-module';
import ostBalanceModule from '../ost-balance/ost-balance-module';
import readWriteHeatMapModule
  from '../read-write-heat-map/read-write-heat-map-module';
import BaseDashboardCtrl from './base-dashboard-controller';

export default angular
  .module('baseDashboard', [
    extendScopeModule,
    hostCpuRamChartModule,
    readWriteBandwidthModule,
    mdoModule,
    ostBalanceModule,
    readWriteHeatMapModule
  ])
  .controller('BaseDashboardCtrl', BaseDashboardCtrl).name;
