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

import {__, invoke} from 'intel-fp/fp';


angular.module('baseDashboardRoute')
  .config(function dashboardBaseSegment ($routeSegmentProvider) {
    'ngInject';

    $routeSegmentProvider
      .when('/', 'app.dashboard.base')
      .when('/dashboard', 'app.dashboard.base')
      .when('/dashboard/fs/:fsId', 'app.dashboard.base')
      .within('app')
      .within('dashboard')
      .segment('base', {
        controller: 'BaseDashboardCtrl',
        controllerAs: 'baseDashboard',
        templateUrl: 'iml/dashboard/assets/html/base-dashboard.html',
        resolve: {
          charts: ['baseDashboardChartResolves', invoke(__, [])],
          fsStream: ['baseDashboardFsStream', invoke(__, [])]
        },
        untilResolved: {
          templateUrl: 'common/loading/assets/html/loading.html'
        },
        dependencies: ['fsId']
      });
  });

