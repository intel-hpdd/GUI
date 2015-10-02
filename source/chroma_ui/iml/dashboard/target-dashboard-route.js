//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2015 Intel Corporation All Rights Reserved.
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

angular.module('targetDashboardRoute')
  .config(function dashboardTargetSegment ($routeSegmentProvider) {
    $routeSegmentProvider
      .when('/dashboard/fs/:fsId/MDT/:targetId', 'app.dashboard.target', { kind: 'MDT' })
      .when('/dashboard/server/:serverId/MDT/:targetId', 'app.dashboard.target', { kind: 'MDT' })
      .when('/dashboard/fs/:fsId/OST/:targetId', 'app.dashboard.target', { kind: 'OST' })
      .when('/dashboard/server/:serverId/OST/:targetId', 'app.dashboard.target', { kind: 'OST' })
      .within('app')
      .within('dashboard')
      .segment('target', {
        controller: 'TargetDashboardController',
        controllerAs: 'targetDashboard',
        templateUrl: 'iml/dashboard/assets/html/target-dashboard.html',
        resolve: {
          kind: ['targetDashboardKind', fp.invoke(fp.__, [])],
          charts: ['targetDashboardResolves', fp.invoke(fp.__, [])],
          targetStream: ['targetDashboardTargetStream', fp.invoke(fp.__, [])],
          usageStream: ['targetDashboardUsageStream', fp.invoke(fp.__, [])]
        },
        untilResolved: {
          templateUrl: 'common/loading/assets/html/loading.html'
        },
        dependencies: ['fsId', 'serverId', 'targetId']
      });

  });
