// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import extendScopeModule from '../extend-scope-module';
import fileUsageModule from '../file-usage/file-usage-module';
import spaceUsageModule from '../space-usage/space-usage-module';
import mdoModule from '../mdo/mdo-module';
import readWriteBandwidthModule from '../read-write-bandwidth/read-write-bandwidth-module';
import highlandModule from '../highland/highland-module';
import TargetDashboardController from './target-dashboard-controller';

export default angular
  .module('targetDashboard', [
    extendScopeModule,
    fileUsageModule,
    spaceUsageModule,
    mdoModule,
    readWriteBandwidthModule,
    highlandModule
  ])
  .controller('TargetDashboardController', TargetDashboardController).name;
