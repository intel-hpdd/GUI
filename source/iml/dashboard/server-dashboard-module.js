//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import extendScopeModule from '../extend-scope-module';
import readWriteBandwidthModule from '../read-write-bandwidth/read-write-bandwidth-module';
import cpuUsageModule from '../cpu-usage/cpu-usage-module';
import memoryUsageModule from '../memory-usage/memory-usage-module';
import ServerDashboardCtrl from './server-dashboard-controller';
import {serverDashboardChartResolvesFactory, serverDashboardHostStreamResolvesFactory}
  from './server-dashboard-resolves';

export default angular
  .module('serverDashboard', [
    extendScopeModule, readWriteBandwidthModule,
    cpuUsageModule, memoryUsageModule
  ])
  .controller('ServerDashboardCtrl', ServerDashboardCtrl)
  .factory('serverDashboardChartResolves', serverDashboardChartResolvesFactory)
  .factory('serverDashboardHostStreamResolves', serverDashboardHostStreamResolvesFactory)
  .name;
