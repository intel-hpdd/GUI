// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import uiBootstrapModule from 'angular-ui-bootstrap';
import ngResource from 'angular-resource';
import uiRouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';
import environmentModule from './environment-module';
import exceptionModule from './exception/exception-module';
import routeToModule from './route-to/route-to-module';
import loginModule from './login/login-module';
import appModule from './app/app-module';
import dashboardModule from './dashboard/dashboard-module';
import baseDashboardModule from './dashboard/base-dashboard-module';
import serverDashboardModule from './dashboard/server-dashboard-module';
import targetDashboardModule from './dashboard/target-dashboard-module';
import serverModule from './server/server-module';
import jobStatsModule from './job-stats/job-stats-module';
import hsmFsModule from './hsm/hsm-fs-module';
import hsmModule from './hsm/hsm-module';
import aboutModule from './about/about-module';
import modalDecoratorModule from './modal-decorator/modal-decorator-module';
import interceptorModule from './interceptors/interceptor-module';
import statusModule from './status/status-module';
import modelFactoryModule from './model-factory/model-factory-module';
import mgtModule from './mgt/mgt-module';
import disconnectModalModule from './disconnect-modal/disconnect-modal-module.js';
import logModule from './logs/log-module.js';
import treeModule from './tree/tree-module.js';
import fileSystemModule from './file-system/file-system-module.js';
import qsStreamModule from './qs-stream/qs-stream-module.js';
import multiTogglerModule from './multi-toggler/multi-toggler-module.js';
import chartTransformersModule from './chart-transformers/chart-transformers-module.js';
import resettableGroupModule from './resettable-group/resettable-group-module.js';
import oldRouteModule from './old-gui-shim/old-route-module.js';
import asViewerDirective from './as-viewer/as-viewer.js';
import sliderPanelComponent from './panels/slider-panel-component.js';
import sidePanelComponent from './panels/side-panel-component.js';
import rootPanelComponent from './panels/root-panel-component.js';
import toggleSidePanelComponent from './panels/toggle-side-panel-component.js';
import routeTransitions from './route-transitions.js';
import breadcrumbComponent from './breadcrumb/breadcrumb.js';
import pageTitleComponent from './page-title/page-title-component.js';
import uiLoaderViewDirective from './ui-loader-view-directive.js';
import confirmButtonComponent from './confirm-button.js';

import {
  loginState
} from './login/login-states.js';


import {
  appState
} from './app/app-states.js';

import {
  mgtState
} from './mgt/mgt-states.js';

import {
  statusState,
  queryState,
  tableState
} from './status/status-states.js';

import {
  aboutState
} from './about/about-states.js';

import {
  serverState,
  serverDetailState
} from './server/server-states.js';

import {
  fileSystemListState
} from './file-system/file-system-states.js';

import {
  logState,
  logTableState
} from './logs/log-states.js';

import {
  hsmFsState,
  hsmState
} from './hsm/hsm-states.js';

import {
  jobStatsState
} from './job-stats/job-stats-states.js';

import {
  dashboardState,
  dashboardOverviewState,
  dashboardServerState,
  dashboardOstState,
  dashboardMdtState,
  dashboardFsState
} from './dashboard/dashboard-states.js';

import oldGUIStates from './old-gui-shim/old-gui-states.js';

import './target/target-dispatch-source.js';
import './alert-indicator/alert-indicator-dispatch-source.js';
import './lnet/lnet-dispatch-source.js';
import './server/server-dispatch-source.js';
import './file-system/file-system-dispatch-source.js';
import './user/user-dispatch-source.js';
import './job-indicator/job-indicator-dispatch-source.js';

import stateLabelTooltipTemplate from './alert-indicator/assets/html/state-label.html!text';
import agentBinaryTooltipTemplate from './hsm/assets/html/modal-tooltips/agent-binary-tooltip.html!text';
import mountpointTooltipTemplate from './hsm/assets/html/modal-tooltips/mountpoint-tooltip.html!text';
import archiveTooltipTemplate from './hsm/assets/html/modal-tooltips/archive-tooltip.html!text';
import loginUserErrorTemplate from './login/assets/html/login-user-error.html!text';
import loginPasswordErrorTemplate from './login/assets/html/login-password-error.html!text';
import jobTemplate from './command/assets/html/job.html!text';

export default angular.module('iml', [
  uiBootstrapModule, ngResource, ngAnimate,
  routeToModule, environmentModule, exceptionModule, uiRouter,
  loginModule, qsStreamModule,
  appModule, dashboardModule,
  baseDashboardModule, serverDashboardModule,
  targetDashboardModule, serverModule,
  jobStatsModule, hsmFsModule,
  hsmModule, multiTogglerModule,
  modalDecoratorModule, interceptorModule, statusModule,
  modelFactoryModule, mgtModule, logModule,
  disconnectModalModule, treeModule, aboutModule,
  fileSystemModule, chartTransformersModule, resettableGroupModule,
  oldRouteModule
])
  .config($compileProvider => {
    'ngInject';

    $compileProvider.debugInfoEnabled(false);
  })
  .config($locationProvider => {
    'ngInject';

    $locationProvider.html5Mode(true).hashPrefix('!');
  })
  .config($httpProvider => {
    'ngInject';

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  })
  .config(modelFactoryProvider => {
    'ngInject';

    modelFactoryProvider.setUrlPrefix('/api/');
  })
  .config($animateProvider => {
    'ngInject';

    $animateProvider.classNameFilter(/^((?!(fa-spin)).)*$/);
  })
  .config($urlMatcherFactoryProvider => {
    'ngInject';

    $urlMatcherFactoryProvider
      .strictMode(false);
  })
  .config(($stateProvider) => {
    'ngInject';

    $stateProvider
      .state(loginState)
      .state(appState)
      .state(mgtState)
      .state(statusState)
      .state(tableState)
      .state(queryState)
      .state(aboutState)
      .state(serverState)
      .state(serverDetailState)
      .state(fileSystemListState)
      .state(logTableState)
      .state(logState)
      .state(hsmFsState)
      .state(hsmState)
      .state(dashboardState)
      .state(dashboardOverviewState)
      .state(dashboardServerState)
      .state(dashboardOstState)
      .state(dashboardMdtState)
      .state(dashboardFsState)
      .state(jobStatsState);

    oldGUIStates.forEach(s => $stateProvider.state(s));
  })
  .directive('asViewer', asViewerDirective)
  .component('sliderPanel', sliderPanelComponent)
  .component('sidePanel', sidePanelComponent)
  .component('rootPanel', rootPanelComponent)
  .component('toggleSidePanel', toggleSidePanelComponent)
  .component('breadcrumb', breadcrumbComponent)
  .component('pageTitle', pageTitleComponent)
  .component('confirmButton', confirmButtonComponent)
  .directive('uiLoaderView', uiLoaderViewDirective)
  .run(routeTransitions)
  .run(($templateCache) => {
    'ngInject';

    $templateCache.put('/static/chroma_ui/state-label.html', stateLabelTooltipTemplate);
    $templateCache.put('/static/chroma_ui/agent-binary-tooltip.html', agentBinaryTooltipTemplate);
    $templateCache.put('/static/chroma_ui/mountpoint-tooltip.html', mountpointTooltipTemplate);
    $templateCache.put('/static/chroma_ui/archive-tooltip.html', archiveTooltipTemplate);
    $templateCache.put('/static/chroma_ui/login-password-error.html', loginPasswordErrorTemplate);
    $templateCache.put('/static/chroma_ui/login-user-error.html', loginUserErrorTemplate);
    $templateCache.put('/static/chroma_ui/job.html', jobTemplate);
  })
  .name;

angular.bootstrap(
  document,
  ['iml'],
  {}
);
