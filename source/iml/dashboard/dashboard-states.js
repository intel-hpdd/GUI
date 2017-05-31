// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';
import * as obj from 'intel-obj';

import {
  serverDashboardHostStreamResolves,
  serverDashboardChartResolves
} from './server-dashboard-resolves.js';

import {
  dashboardFsB,
  dashboardHostB,
  dashboardTargetB
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

import {
  streamToPromise
} from '../promise-transforms.js';

import {
  matchById
} from '../api-transforms.js';

import type {
  HighlandStreamT
} from 'highland';

// $FlowIgnore: HTML templates that flow does not recognize.
import dashboardTemplate from './assets/html/dashboard.html!text';

// $FlowIgnore: HTML templates that flow does not recognize.
import baseDashboardTemplate from './assets/html/base-dashboard.html!text';

// $FlowIgnore: HTML templates that flow does not recognize.
import targetDashboardTemplate from './assets/html/target-dashboard.html!text';

// $FlowIgnore: HTML templates that flow does not recognize.
import serverDashboardTemplate from './assets/html/server-dashboard.html!text';

const containsAppDashboard = fp.flow(
  x => x.indexOf('app.dashboard'),
  fp.eq(0)
);

const getDataFn = (b:() => HighlandStreamT<Object>, $stateParams:{ id:string }) => {
  return streamToPromise(b())
    .then(matchById($stateParams.id))
    .then(obj.pick('label'));
};

export const dashboardState = {
  name: 'app.dashboard',
  abstract: true,
  resolve: {
    fsB: dashboardFsB,
    hostsB: dashboardHostB,
    targetsB: dashboardTargetB
  },
  data: {
    helpPage: 'dashboard_charts.htm',
    anonymousReadProtected: true,
    eulaState: true,
    skipWhen: containsAppDashboard
  },
  controller: 'DashboardCtrl',
  controllerAs: 'dashboard',
  template: dashboardTemplate
};

export const dashboardOverviewState = {
  name: 'app.dashboard.overview',
  url: '/dashboard',
  controller: 'BaseDashboardCtrl',
  controllerAs: 'baseDashboard',
  template: baseDashboardTemplate,
  params: {
    resetState: {
      dynamic: true
    }
  },
  data: {
    kind: 'Dashboard',
    icon: 'fa-bar-chart-o'
  },
  resolve: {
    charts: baseDashboardChartResolves
  }
};

export const dashboardServerState = {
  name: 'app.dashboard.server',
  url: '/dashboard/server/:id',
  controller: 'ServerDashboardCtrl',
  controllerAs: 'serverDashboard',
  template: serverDashboardTemplate,
  params: {
    kind: {
      value: 'server',
      squash: true
    },
    resetState: {
      dynamic: true
    }
  },
  data: {
    kind: 'Dashboard - Server',
    icon: 'fa-bar-chart-o'
  },
  resolve: {
    charts: serverDashboardChartResolves,
    hostStream: serverDashboardHostStreamResolves,
    getData: ['hostsB', '$stateParams', getDataFn]
  }
};

export const dashboardMdtState = {
  name: 'app.dashboard.mdt',
  url: '/dashboard/MDT/:id',
  controller: 'TargetDashboardController',
  controllerAs: 'targetDashboard',
  template: targetDashboardTemplate,
  params: {
    kind: {
      value: 'MDT',
      squash: true
    },
    resetState: {
      dynamic: true
    }
  },
  data: {
    kind: 'Dashboard - MDT',
    icon: 'fa-bar-chart-o'
  },
  resolve: {
    charts: targetDashboardResolves,
    targetStream: targetDashboardTargetStream,
    usageStream: targetDashboardUsageStream,
    getData: ['targetsB', '$stateParams', getDataFn]
  }
};

export const dashboardOstState = {
  name: 'app.dashboard.ost',
  url: '/dashboard/OST/:id',
  controller: 'TargetDashboardController',
  controllerAs: 'targetDashboard',
  template: targetDashboardTemplate,
  data: {
    kind: 'Dashboard - OST',
    icon: 'fa-bar-chart-o'
  },
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
    usageStream: targetDashboardUsageStream,
    getData: ['targetsB', '$stateParams', getDataFn]
  }
};

export const dashboardFsState = {
  name: 'app.dashboard.fs',
  url: '/dashboard/fs/:id',
  controller: 'BaseDashboardCtrl',
  controllerAs: 'baseDashboard',
  template: baseDashboardTemplate,
  data: {
    kind: 'Dashboard - FS',
    icon: 'fa-bar-chart-o'
  },
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
    fsStream: baseDashboardFsStream,
    getData: ['fsB', '$stateParams', getDataFn]
  }
};
