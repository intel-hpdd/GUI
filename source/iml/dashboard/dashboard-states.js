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

import * as fp from 'intel-fp';

import {
  serverDashboardHostStreamResolves,
  serverDashboardChartResolves
} from './server-dashboard-resolves.js';

import {
  dashboardFsStream,
  dashboardHostStream,
  dashboardTargetStream
} from './dashboard-resolves.js';

import {
  baseDashboardChartResolves,
  baseDashboardFsStream
} from './base-dashboard-chart-resolves.js';

import {
  targetDashboardResolves,
  targetDashboardUsageStream,
  targetDashboardTargetStream
} from './target-dashboard-resolves.js';

// $FlowIgnore: HTML templates that flow does not recognize.
import dashboardTemplate from './assets/html/dashboard';

// $FlowIgnore: HTML templates that flow does not recognize.
import baseDashboardTemplate from './assets/html/base-dashboard';

// $FlowIgnore: HTML templates that flow does not recognize.
import targetDashboardTemplate from './assets/html/target-dashboard';

// $FlowIgnore: HTML templates that flow does not recognize.
import serverDashboardTemplate from './assets/html/server-dashboard';

const containsAppDashboard = fp.flow(
  x => x.indexOf('app.dashboard'),
  fp.eq(0)
);

export const dashboardState = {
  name: 'app.dashboard',
  abstract: true,
  resolve: {
    fsStream: dashboardFsStream,
    hostStream: dashboardHostStream,
    targetStream: dashboardTargetStream
  },
  data: {
    helpPage: 'dashboard_charts.htm',
    anonymousReadProtected: true,
    eulaState: true,
    skipWhen: containsAppDashboard
  },
  controller: 'DashboardCtrl',
  controllerAs: 'dashboard',
  templateUrl: dashboardTemplate
};

export const dashboardOverviewState = {
  name: 'app.dashboard.overview',
  url: '/dashboard',
  controller: 'BaseDashboardCtrl',
  controllerAs: 'baseDashboard',
  templateUrl: baseDashboardTemplate,
  resolve: {
    charts: baseDashboardChartResolves,
    fsStream: dashboardFsStream
  }
};

export const dashboardAbstractServerState = {
  abstract: true,
  name: 'app.dashboard.server',
  template: '<div ui-view></div>'
};

export const dashboardServerState = {
  name: 'app.dashboard.server.serverItem',
  url: '/dashboard/server/:serverId',
  controller: 'ServerDashboardCtrl',
  controllerAs: 'serverDashboard',
  templateUrl: serverDashboardTemplate,
  resolve: {
    charts: serverDashboardChartResolves,
    hostStream: serverDashboardHostStreamResolves
  }
};

export const dashboardServerMdtState = {
  name: 'app.dashboard.server.mdt',
  url: '/dashboard/server/:serverId/MDT/:targetId',
  controller: 'TargetDashboardController',
  controllerAs: 'targetDashboard',
  templateUrl: targetDashboardTemplate,
  params: {
    kind: {
      value: 'MDT',
      squash: true
    }
  },
  resolve: {
    charts: targetDashboardResolves,
    targetStream: targetDashboardTargetStream,
    usageStream: targetDashboardUsageStream
  }
};

export const dashboardServerOstState = {
  name: 'app.dashboard.server.ost',
  url: '/dashboard/server/:serverId/OST/:targetId',
  controller: 'TargetDashboardController',
  controllerAs: 'targetDashboard',
  templateUrl: targetDashboardTemplate,
  params: {
    kind: {
      value: 'OST',
      squash: true
    }
  },
  resolve: {
    charts: targetDashboardResolves,
    targetStream: targetDashboardTargetStream,
    usageStream: targetDashboardUsageStream
  }
};

export const dashboardAbstractFsState = {
  abstract: true,
  name: 'app.dashboard.fs',
  template: '<div ui-view></div>'
};

export const dashboardFsState = {
  name: 'app.dashboard.fs.fsItem',
  url: '/dashboard/fs/:fsId',
  controller: 'BaseDashboardCtrl',
  controllerAs: 'baseDashboard',
  templateUrl: baseDashboardTemplate,
  resolve: {
    charts: baseDashboardChartResolves,
    fsStream: baseDashboardFsStream
  }
};

export const dashboardFsMdtState = {
  name: 'app.dashboard.fs.mdt',
  url: '/dashboard/fs/:fsId/MDT/:targetId',
  controller: 'TargetDashboardController',
  controllerAs: 'targetDashboard',
  templateUrl: targetDashboardTemplate,
  params: {
    kind: {
      value: 'MDT',
      squash: true
    }
  },
  resolve: {
    charts: targetDashboardResolves,
    targetStream: targetDashboardTargetStream,
    usageStream: targetDashboardUsageStream
  }
};

export const dashboardFsOstState = {
  name: 'app.dashboard.fs.ost',
  url: '/dashboard/fs/:fsId/OST/:targetId',
  controller: 'TargetDashboardController',
  controllerAs: 'targetDashboard',
  templateUrl: targetDashboardTemplate,
  params: {
    kind: {
      value: 'OST',
      squash: true
    }
  },
  resolve: {
    charts: targetDashboardResolves,
    targetStream: targetDashboardTargetStream,
    usageStream: targetDashboardUsageStream
  }
};
