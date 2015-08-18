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


angular.module('imlRoutes', ['imlRouterModule',
  'lnetModule', 'dashboard', 'server', 'statusModule'])
  .config(['$routeSegmentProvider', 'GROUPS', function ($routeSegmentProvider, GROUPS) {
    $routeSegmentProvider
      .within('app')
      .segment('dashboard', untilResolved({
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard',
        templateUrl: 'iml/dashboard/assets/html/dashboard.html',
        resolve: {
          fsStream: ['dashboardFsStream', fp.invoke(fp.__, [])],
          hostStream: ['dashboardHostStream', fp.invoke(fp.__, [])],
          targetStream: ['dashboardTargetStream', fp.invoke(fp.__, [])]
        }
      }));

    $routeSegmentProvider
      .when('/', 'app.dashboard.base')
      .when('/dashboard', 'app.dashboard.base')
      .when('/dashboard/fs/:fsId', 'app.dashboard.base')
      .within('app')
      .within('dashboard')
      .segment('base', untilResolved({
        controller: 'BaseDashboardCtrl',
        controllerAs: 'baseDashboard',
        templateUrl: 'iml/dashboard/assets/html/base-dashboard.html',
        resolve: {
          charts: ['baseDashboardChartResolves', fp.invoke(fp.__, [])],
          fsStream: ['baseDashboardFsStream', fp.invoke(fp.__, [])]
        },
        dependencies: ['fsId']
      }));

    $routeSegmentProvider
      .when('/dashboard/server/:serverId', 'app.dashboard.server')
      .within('app')
      .within('dashboard')
      .segment('server', untilResolved({
        controller: 'ServerDashboardCtrl',
        controllerAs: 'serverDashboard',
        templateUrl: 'iml/dashboard/assets/html/server-dashboard.html',
        resolve: {
          charts: ['$route', 'serverDashboardChartResolves', function getCharts ($route, serverDashboardChartResolves) {
            return serverDashboardChartResolves($route.current.params.serverId);
          }],
          hostStream: ['$route', 'resolveStream', 'socketStream',
            function hostStream ($route, resolveStream, socketStream) {
              return resolveStream(socketStream('/host/' + $route.current.params.serverId, {
                jsonMask: 'label'
              }));
            }
          ]
        },
        dependencies: ['serverId']
      }));

    $routeSegmentProvider
      .when('/dashboard/fs/:fsId/MDT/:targetId', 'app.dashboard.target', { kind: 'MDT' })
      .when('/dashboard/server/:serverId/MDT/:targetId', 'app.dashboard.target', { kind: 'MDT' })
      .when('/dashboard/fs/:fsId/OST/:targetId', 'app.dashboard.target', { kind: 'OST' })
      .when('/dashboard/server/:serverId/OST/:targetId', 'app.dashboard.target', { kind: 'OST' })
      .within('app')
      .within('dashboard')
      .segment('target', untilResolved({
        controller: 'TargetDashboardController',
        controllerAs: 'targetDashboard',
        templateUrl: 'iml/dashboard/assets/html/target-dashboard.html',
        resolve: {
          kind: ['targetDashboardKind', fp.invoke(fp.__, [])],
          charts: ['targetDashboardResolves', fp.invoke(fp.__, [])],
          targetStream: ['targetDashboardTargetStream', fp.invoke(fp.__, [])],
          usageStream: ['targetDashboardUsageStream', fp.invoke(fp.__, [])]
        },
        dependencies: ['fsId', 'serverId', 'targetId']
      }));

    $routeSegmentProvider
      .when('/configure/server', 'app.server')
      .within('app')
      .segmentAuthenticated('server', untilResolved({
        controller: 'ServerCtrl',
        templateUrl: 'iml/server/assets/html/server.html',
        resolve: {
          streams: ['serverStreamsResolves', fp.invoke(fp.__, [])]
        },
        access: GROUPS.FS_ADMINS
      }));


    $routeSegmentProvider
      .when('/configure/server/:id', 'app.serverDetail')
      .within('app')
      .segmentAuthenticated('serverDetail', untilResolved({
        controller: 'ServerDetailController',
        controllerAs: 'serverDetail',
        templateUrl: 'iml/server/assets/html/server-detail.html',
        resolve: {
          streams: ['serverDetailResolves', '$route', function getStreams (serverDetailResolves, $route) {
            return serverDetailResolves($route);
          }]
        },
        access: GROUPS.FS_ADMINS
      }));

    $routeSegmentProvider.when('/dashboard/jobstats/:id/:startDate/:endDate', 'app.jobstats');

    $routeSegmentProvider
      .within('app')
      .segment('jobstats', untilResolved({
        controller: 'JobStatsCtrl',
        controllerAs: 'jobStats',
        templateUrl: 'iml/job-stats/assets/html/job-stats.html',
        resolve: {
          target: ['$route', 'TargetModel', function resolveTarget ($route, TargetModel) {
            return TargetModel.get({
              id: $route.current.params.id
            }).$promise;
          }],
          metrics: ['$q', '$route', 'TargetMetricModel', function resolveMetrics ($q, $route, TargetMetricModel) {
            var commonParams = {
              begin: $route.current.params.startDate,
              end: $route.current.params.endDate,
              job: 'id',
              id: $route.current.params.id
            };
            var metrics = ['read_bytes', 'write_bytes', 'read_iops', 'write_iops'];

            var promises = metrics.reduce(function reducer (out, metric) {

              var params = _.extend({}, commonParams, {metrics: metric});

              out[metric] = TargetMetricModel.getJobAverage(params);

              return out;
            }, {});

            return $q.all(promises);
          }]
        }
      }));

    $routeSegmentProvider
      .when('/status', 'app.status')
      .within('app')
      .segment('status', untilResolved({
        controller: 'StatusController',
        controllerAs: 'ctrl',
        templateUrl: 'iml/status/assets/html/status.html'
      }));

    function untilResolved (obj) {
      return _.extend({}, obj, {
        untilResolved: {
          templateUrl: 'common/loading/assets/html/loading.html'
        }
      });
    }
  }]);
