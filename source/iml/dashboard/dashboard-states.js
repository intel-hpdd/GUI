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

import { streamToPromise } from '../promise-transforms.js';

import { matchById } from '../api-transforms.js';

import * as maybe from '@mfl/maybe';

import type { HighlandStreamT } from 'highland';

import dashboardTemplate from './assets/html/dashboard.html';
import baseDashboardTemplate from './assets/html/base-dashboard.html';
import targetDashboardTemplate from './assets/html/target-dashboard.html';
import serverDashboardTemplate from './assets/html/server-dashboard.html';

const getDataFn = (
  b: () => HighlandStreamT<Object[]>,
  $stateParams: { id: string }
) => {
  return streamToPromise(b())
    .then(matchById($stateParams.id))
    .then(maybe.map.bind(null, (x: Object) => ({ label: x.label })))
    .then(maybe.withDefault.bind(null, () => ({ label: '' })));
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
    eulaState: true
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
