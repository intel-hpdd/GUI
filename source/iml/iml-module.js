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

import '../styles/imports.less';

import './target/target-dispatch-source.js';
import './alert-indicator/alert-indicator-dispatch-source.js';
import './lnet/lnet-dispatch-source.js';
import './server/server-dispatch-source.js';
import './file-system/file-system-dispatch-source.js';
import './user/user-dispatch-source.js';
import './job-indicator/job-indicator-dispatch-source.js';
import './session/session-dispatch-source.js';

import * as ENV from './environment.js';
import angular from 'angular';
import uiBootstrapModule from 'angular-ui-bootstrap';
import ngResource from 'angular-resource';
import uiRouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';
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
import aboutComponent from './about/about-component.js';
import modalDecoratorModule from './modal-decorator/modal-decorator-module';
import interceptorModule from './interceptors/interceptor-module';
import statusModule from './status/status-module';
import modelFactoryModule from './model-factory/model-factory-module';
import mgtModule from './mgt/mgt-module';
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
import storageModule from './storage/storage-module.js';

import { loginState } from './login/login-states.js';

import { appState } from './app/app-states.js';

import { mgtState } from './mgt/mgt-states.js';

import { statusState, queryState, tableState } from './status/status-states.js';

import { aboutState } from './about/about-states.js';

import { serverState, serverDetailState } from './server/server-states.js';

import { fileSystemListState } from './file-system/file-system-states.js';

import { logState, logTableState } from './logs/log-states.js';

import { hsmFsState, hsmState } from './hsm/hsm-states.js';

import { jobStatsState } from './job-stats/job-stats-states.js';

import { storageState } from './storage/storage-states.js';

import {
  dashboardState,
  dashboardOverviewState,
  dashboardServerState,
  dashboardOstState,
  dashboardMdtState,
  dashboardFsState
} from './dashboard/dashboard-states.js';

import oldGUIStates from './old-gui-shim/old-gui-states.js';

import jobTemplate from './command/assets/html/job.html';

import {
  getHostProfilesFactory,
  createHostProfilesFactory
} from './server/create-host-profiles-stream';

import { imlTooltip } from './tooltip/tooltip.js';
import imlPopover from './iml-popover.js';
import Position from './position.js';
import { recordStateDirective } from './alert-indicator/alert-indicator.js';
import jobStatus from './job-indicator/job-indicator.js';
import pdsh from './pdsh/pdsh.js';
import help from './help.js';
import windowUnload from './window-unload.js';
import disconnectModal from './disconnect-modal/disconnect-modal.js';
import disconnectListener from './disconnect-modal/disconnect-listener.js';

const imlModule = angular
  .module('iml', [
    uiBootstrapModule,
    ngResource,
    ngAnimate,
    routeToModule,
    exceptionModule,
    uiRouter,
    loginModule,
    qsStreamModule,
    appModule,
    dashboardModule,
    baseDashboardModule,
    serverDashboardModule,
    targetDashboardModule,
    serverModule,
    jobStatsModule,
    hsmFsModule,
    hsmModule,
    multiTogglerModule,
    modalDecoratorModule,
    interceptorModule,
    statusModule,
    modelFactoryModule,
    mgtModule,
    logModule,
    treeModule,
    fileSystemModule,
    chartTransformersModule,
    resettableGroupModule,
    oldRouteModule,
    storageModule
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
    $urlMatcherFactoryProvider.strictMode(false);
  })
  .config($stateProvider => {
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
      .state(jobStatsState)
      .state(storageState);

    oldGUIStates.forEach(s => $stateProvider.state(s));
  })
  .directive('asViewer', asViewerDirective)
  .component('aboutComponent', aboutComponent)
  .component('sliderPanel', sliderPanelComponent)
  .component('sidePanel', sidePanelComponent)
  .component('rootPanel', rootPanelComponent)
  .component('toggleSidePanel', toggleSidePanelComponent)
  .component('breadcrumb', breadcrumbComponent)
  .component('pageTitle', pageTitleComponent)
  .directive('uiLoaderView', uiLoaderViewDirective)
  .directive('imlTooltip', imlTooltip)
  .directive('jobStatus', jobStatus)
  .service('position', Position)
  .directive('imlPopover', imlPopover)
  .factory('getHostProfiles', getHostProfilesFactory)
  .factory('createHostProfiles', createHostProfilesFactory)
  .factory('help', help)
  .factory('windowUnload', windowUnload)
  .factory('disconnectModal', disconnectModal)
  .directive('recordState', recordStateDirective)
  .directive('pdsh', pdsh)
  .constant('STATE_SIZE', {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large'
  })
  .value('ENV', ENV)
  .run(routeTransitions)
  .run($templateCache => {
    'ngInject';
    $templateCache.put('/gui/job.html', jobTemplate);
  })
  .run(disconnectModal => {
    'ngInject';
    disconnectListener.on('open', disconnectModal.open);
    disconnectListener.on('close', disconnectModal.close);
  });

Object.keys(ENV).forEach(key => imlModule.value(key, ENV[key]));

angular.bootstrap(document, ['iml'], {});
