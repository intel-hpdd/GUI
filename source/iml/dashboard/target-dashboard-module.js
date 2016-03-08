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
import extendScopeModule from '../extend-scope-module';
import fileUsageModule from '../file-usage/file-usage-module';
import spaceUsageModule from '../space-usage/space-usage-module';
import mdoModule from '../mdo/mdo-module';
import readWriteBandwidthModule from '../read-write-bandwidth/read-write-bandwidth-module';
import socketModule from '../socket/socket-module';
import highlandModule from '../highland/highland-module';
import TargetDashboardController from './target-dashboard-controller';
import {
  targetDashboardKindFactory,
  targetDashboardResolvesFactory,
  targetDashboardTargetStreamFactory,
  targetDashboardUsageStreamFactory
} from './target-dashboard-resolves';

export default angular
  .module('targetDashboard', [
    extendScopeModule, fileUsageModule, spaceUsageModule, mdoModule, readWriteBandwidthModule,
    socketModule, highlandModule
  ])
  .controller('TargetDashboardController', TargetDashboardController)
  .factory('targetDashboardKind', targetDashboardKindFactory)
  .factory('targetDashboardResolves', targetDashboardResolvesFactory)
  .factory('targetDashboardTargetStream', targetDashboardTargetStreamFactory)
  .factory('targetDashboardUsageStream', targetDashboardUsageStreamFactory)
  .name;