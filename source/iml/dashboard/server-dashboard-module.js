//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import extendScopeModule from '../extend-scope-module';
import readWriteBandwidthModule from '../read-write-bandwidth/read-write-bandwidth-module';
import cpuUsageModule from '../cpu-usage/cpu-usage-module';
import memoryUsageModule from '../memory-usage/memory-usage-module';
import ServerDashboardCtrl from './server-dashboard-controller';
import { serverDashboardChartResolves, serverDashboardHostStreamResolves } from './server-dashboard-resolves';

export default angular
  .module('serverDashboard', [extendScopeModule, readWriteBandwidthModule, cpuUsageModule, memoryUsageModule])
  .controller('ServerDashboardCtrl', ServerDashboardCtrl)
  .factory('serverDashboardChartResolves', serverDashboardChartResolves)
  .factory('serverDashboardHostStreamResolves', serverDashboardHostStreamResolves).name;
