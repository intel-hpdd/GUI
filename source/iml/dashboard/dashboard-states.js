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
  url: '/dashboard',
  redirectTo: 'app.dashboard.overview',
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
  url: '/',
  controller: 'BaseDashboardCtrl',
  controllerAs: 'baseDashboard',
  templateUrl: baseDashboardTemplate,
  params: {
    resetState: {
      dynamic: true
    }
  },
  resolve: {
    charts: baseDashboardChartResolves,
    fsStream: dashboardFsStream
  }
};

export const dashboardServerState = {
  name: 'app.dashboard.server',
  url: '/server/:id',
  controller: 'ServerDashboardCtrl',
  controllerAs: 'serverDashboard',
  templateUrl: serverDashboardTemplate,
  params: {
    kind: {
      value: 'server',
      squash: true
    },
    resetState: {
      dynamic: true
    }
  },
  resolve: {
    charts: serverDashboardChartResolves,
    hostStream: serverDashboardHostStreamResolves
  }
};

export const dashboardMdtState = {
  name: 'app.dashboard.mdt',
  url: '/MDT/:id',
  controller: 'TargetDashboardController',
  controllerAs: 'targetDashboard',
  templateUrl: targetDashboardTemplate,
  params: {
    kind: {
      value: 'MDT',
      squash: true
    },
    resetState: {
      dynamic: true
    }
  },
  resolve: {
    charts: targetDashboardResolves,
    targetStream: targetDashboardTargetStream,
    usageStream: targetDashboardUsageStream
  }
};

export const dashboardOstState = {
  name: 'app.dashboard.ost',
  url: '/OST/:id',
  controller: 'TargetDashboardController',
  controllerAs: 'targetDashboard',
  templateUrl: targetDashboardTemplate,
  params: {
    kind: {
      value: 'OST',
      squash: true
    },
    resetState: {
      dynamic: true
    }
  },
  resolve: {
    charts: targetDashboardResolves,
    targetStream: targetDashboardTargetStream,
    usageStream: targetDashboardUsageStream
  }
};

export const dashboardFsState = {
  name: 'app.dashboard.fs',
  url: '/fs/:id',
  controller: 'BaseDashboardCtrl',
  controllerAs: 'baseDashboard',
  templateUrl: baseDashboardTemplate,
  params: {
    kind: {
      value: 'fs',
      squash: true
    },
    resetState: {
      dynamic: true
    }
  },
  resolve: {
    charts: baseDashboardChartResolves,
    fsStream: baseDashboardFsStream
  }
};
