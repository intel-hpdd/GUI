import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('dashboard states', () => {
  let mod,
    dashboardFsStream,
    dashboardHostStream,
    dashboardTargetStream,
    baseDashboardChartResolves,
    baseDashboardFsStream,
    serverDashboardChartResolves,
    serverDashboardHostStreamResolves,
    targetDashboardResolves,
    targetDashboardUsageStream,
    targetDashboardTargetStream;

  beforeEachAsync(async function () {
    dashboardFsStream = 'dashboardFsStream';
    dashboardHostStream = 'dashboardHostStream';
    dashboardTargetStream = 'dashboardTargetStream';
    baseDashboardChartResolves = 'baseDashboardChartResolves';
    baseDashboardFsStream = 'baseDashboardFsStream';
    serverDashboardChartResolves = 'serverDashboardChartResolves';
    serverDashboardHostStreamResolves = 'serverDashboardHostStreamResolves';
    targetDashboardResolves = 'targetDashboardResolves';
    targetDashboardUsageStream = 'targetDashboardUsageStream';
    targetDashboardTargetStream = 'targetDashboardTargetStream';

    mod = await mock('source/iml/dashboard/dashboard-states.js', {
      'source/iml/dashboard/dashboard-resolves.js': {
        dashboardFsStream,
        dashboardHostStream,
        dashboardTargetStream
      },
      'source/iml/dashboard/base-dashboard-chart-resolves.js': {
        baseDashboardChartResolves,
        baseDashboardFsStream
      },
      'source/iml/dashboard/server-dashboard-resolves.js': {
        serverDashboardChartResolves,
        serverDashboardHostStreamResolves
      },
      'source/iml/dashboard/target-dashboard-resolves.js': {
        targetDashboardResolves,
        targetDashboardUsageStream,
        targetDashboardTargetStream
      }
    });
  });

  afterEach(resetAll);

  describe('dashboard state', () => {
    it('should create the state', () => {
      expect(mod.dashboardState)
        .toEqual({
          name: 'app.dashboard',
          url: '/dashboard',
          redirectTo: 'app.dashboard.overview',
          resolve: {
            fsStream: 'dashboardFsStream',
            hostStream: 'dashboardHostStream',
            targetStream: 'dashboardTargetStream'
          },
          data: {
            anonymousReadProtected: true,
            eulaState: true,
            helpPage: 'dashboard_charts.htm',
            skipWhen: jasmine.any(Function)
          },
          controller: 'DashboardCtrl',
          controllerAs: 'dashboard',
          templateUrl: '/static/chroma_ui/source/iml/dashboard/assets/html/dashboard.js'
        });
    });
  });

  describe('dashboard overview state', () => {
    it('should create the state', () => {
      expect(mod.dashboardOverviewState)
        .toEqual({
          name: 'app.dashboard.overview',
          url: '/',
          controller: 'BaseDashboardCtrl',
          controllerAs: 'baseDashboard',
          templateUrl: '/static/chroma_ui/source/iml/dashboard/assets/html/base-dashboard.js',
          params: {
            resetState: {
              dynamic: true
            }
          },
          resolve: {
            charts: 'baseDashboardChartResolves',
            fsStream: 'dashboardFsStream'
          }
        });
    });
  });

  describe('dashboard server state', () => {
    it('should create the state', () => {
      expect(mod.dashboardServerState)
        .toEqual({
          name: 'app.dashboard.server',
          url: '/server/:id',
          controller: 'ServerDashboardCtrl',
          controllerAs: 'serverDashboard',
          templateUrl: '/static/chroma_ui/source/iml/dashboard/assets/html/server-dashboard.js',
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
            charts: 'serverDashboardChartResolves',
            hostStream: 'serverDashboardHostStreamResolves'
          }
        });
    });
  });

  describe('dashboard MDT state', () => {
    it('should create the state', () => {
      expect(mod.dashboardMdtState)
        .toEqual({
          name: 'app.dashboard.mdt',
          url: '/MDT/:id',
          controller: 'TargetDashboardController',
          controllerAs: 'targetDashboard',
          templateUrl: '/static/chroma_ui/source/iml/dashboard/assets/html/target-dashboard.js',
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
            charts: 'targetDashboardResolves',
            targetStream: 'targetDashboardTargetStream',
            usageStream: 'targetDashboardUsageStream'
          }
        });
    });
  });

  describe('dashboard OST state', () => {
    it('should create the state', () => {
      expect(mod.dashboardOstState)
        .toEqual({
          name: 'app.dashboard.ost',
          url: '/OST/:id',
          controller: 'TargetDashboardController',
          controllerAs: 'targetDashboard',
          templateUrl: '/static/chroma_ui/source/iml/dashboard/assets/html/target-dashboard.js',
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
            charts: 'targetDashboardResolves',
            targetStream: 'targetDashboardTargetStream',
            usageStream: 'targetDashboardUsageStream'
          }
        });
    });
  });

  describe('dashboard fs state', () => {
    it('should create the state', () => {
      expect(mod.dashboardFsState)
        .toEqual({
          name: 'app.dashboard.fs',
          url: '/fs/:id',
          controller: 'BaseDashboardCtrl',
          controllerAs: 'baseDashboard',
          templateUrl: '/static/chroma_ui/source/iml/dashboard/assets/html/base-dashboard.js',
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
            charts: 'baseDashboardChartResolves',
            fsStream: 'baseDashboardFsStream'
          }
        });
    });
  });
});
