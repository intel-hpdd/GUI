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



  angular.module('iml', ['ui.bootstrap', 'environment', 'exception', 'ngRoute', 'route-to', 'route-segment',
    'view-segment', 'middleware', 'login', 'loginRoute', 'app', 'appRouteModule', 'dashboard',
    'dashboardRoute', 'baseDashboard', 'baseDashboardRoute', 'serverDashboard',
    'serverDashboardRoute', 'targetDashboard', 'targetDashboardRoute', 'server', 'serverRoute', 'serverDetailRoute',
    'jobStats', 'jobStatsRoute', 'hsmFs', 'hsmFsRoute', 'hsm', 'hsmRoute',
    'about', 'ngAnimate', 'modal-decorator', 'interceptors', 'status', 'statusQueryRouteModule',
    'statusRecordsRouteModule'])
    .config(['$compileProvider', function ($compileProvider) {
      $compileProvider.debugInfoEnabled(false);
    }])
    .config(['$locationProvider', function ($locationProvider) {
      $locationProvider.html5Mode(true).hashPrefix('!');
    }])
    .config(['$httpProvider', function ($httpProvider) {
      $httpProvider.defaults.xsrfCookieName = 'csrftoken';
      $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])
    .config(['modelFactoryProvider', function (modelFactoryProvider) {
      modelFactoryProvider.setUrlPrefix('/api/');
    }])
    .config(['$animateProvider', function ($animateProvider) {
      $animateProvider.classNameFilter(/^((?!(fa-spin)).)*$/);
    }])
    .config(['$routeSegmentProvider', function ($routeSegmentProvider) {
      $routeSegmentProvider.options.autoLoadTemplates = true;
      $routeSegmentProvider.options.strictMode = true;
      $routeSegmentProvider.options.resolveMiddleware = 'processMiddleware';
    }]);
