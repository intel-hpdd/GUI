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
import uiBootstrapModule from 'angular-ui-bootstrap';
import ngResource from 'angular-resource';
import ngRoute from 'angular-route';
import 'intel-angular-route-segment';
import ngAnimate from 'angular-animate';
import environmentModule from './environment-module';
import exceptionModule from './exception/exception-module';
import routeToModule from './route-to/route-to-module';
import middlewareModule from './middleware/middleware-module';
import loginModule from './login/login-module';
import loginRouteModule from './login/login-route-module';
import appModule from './app/app-module';
import appRouteModule from './app/app-route-module';
import dashboardModule from './dashboard/dashboard-module';
import dashboardRouteModule from './dashboard/dashboard-route-module';
import baseDashboardModule from './dashboard/base-dashboard-module';
import baseDashboardRouteModule from './dashboard/base-dashboard-route-module';
import serverDashboardModule from './dashboard/server-dashboard-module';
import serverDashboardRouteModule from './dashboard/server-dashboard-route-module';
import targetDashboardModule from './dashboard/target-dashboard-module';
import targetDashboardRouteModule from './dashboard/target-dashboard-route-module';
import serverModule from './server/server-module';
import serverRouteModule from './server/server-route-module';
import serverDetailRouteModule from './server/server-detail-route-module';
import jobStatsModule from './job-stats/job-stats-module';
import jobStatsRouteModule from './job-stats/job-stats-route-module';
import hsmFsModule from './hsm/hsm-fs-module';
import hsmFsRouteModule from './hsm/hsm-fs-route-module';
import hsmModule from './hsm/hsm-module';
import hsmRouteModule from './hsm/hsm-route-module';
import aboutModule from './about/about-module';
import modalDecoratorModule from './modal-decorator/modal-decorator-module';
import interceptorModule from './interceptors/interceptor-module';
import statusModule from './status/status-module';
import statusQueryRouteModule from './status/status-query-route-module';
import statusRecordsRouteModule from './status/status-records-route-module';
import modelFactoryModule from './model-factory/model-factory-module';

export default angular.module('iml', [
  uiBootstrapModule, ngResource, ngRoute, ngAnimate, 'route-segment', 'view-segment',
  routeToModule, environmentModule, exceptionModule,
  middlewareModule, loginModule, loginRouteModule, appModule, appRouteModule, dashboardModule,
  dashboardRouteModule, baseDashboardModule, baseDashboardRouteModule, serverDashboardModule,
  serverDashboardRouteModule, targetDashboardModule, targetDashboardRouteModule, serverModule, serverRouteModule,
  serverDetailRouteModule, jobStatsModule, jobStatsRouteModule,
  hsmFsModule, hsmFsRouteModule, hsmModule, hsmRouteModule,
  aboutModule, modalDecoratorModule, interceptorModule, statusModule, statusQueryRouteModule,
  statusRecordsRouteModule, modelFactoryModule
])
  .config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
  }
  ])
  .config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
  }
  ])
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  }
  ])
  .config(['modelFactoryProvider', function (modelFactoryProvider) {
    modelFactoryProvider.setUrlPrefix('/api/');
  }
  ])
  .config(['$animateProvider', function ($animateProvider) {
    $animateProvider.classNameFilter(/^((?!(fa-spin)).)*$/);
  }
  ])
  .config(['$routeSegmentProvider', function ($routeSegmentProvider) {
    $routeSegmentProvider.options.autoLoadTemplates = true;
    $routeSegmentProvider.options.strictMode = true;
    $routeSegmentProvider.options.resolveMiddleware = 'processMiddleware';
  }
  ])
  .name;

angular.bootstrap(document, ['iml'], {
  strictDi: true
});