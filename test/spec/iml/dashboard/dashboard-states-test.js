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
          abstract: true,
          data: {
            anonymousReadProtected: true,
            eulaState: true,
            helpPage: 'dashboard_charts.htm',
            skipWhen: jasmine.any(Function)
          },
          resolve: {
            fsStream: 'dashboardFsStream',
            hostStream: 'dashboardHostStream',
            targetStream: 'dashboardTargetStream'
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
          url: '/dashboard',
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

  describe('dashboard abstract server state', () => {
    it('should create the state', () => {
      expect(mod.dashboardAbstractServerState)
        .toEqual({
          abstract: true,
          name: 'app.dashboard.server',
          template: '<div ui-view></div>'
        });
    });
  });

  describe('dashboard server state', () => {
    it('should create the state', () => {
      expect(mod.dashboardServerState)
        .toEqual({
          name: 'app.dashboard.server.serverItem',
          url: '/dashboard/server/:serverId',
          controller: 'ServerDashboardCtrl',
          controllerAs: 'serverDashboard',
          templateUrl: '/static/chroma_ui/source/iml/dashboard/assets/html/server-dashboard.js',
          resolve: {
            charts: 'serverDashboardChartResolves',
            hostStream: 'serverDashboardHostStreamResolves'
          }
        });
    });
  });

  describe('dashboard server MDT state', () => {
    it('should create the state', () => {
      expect(mod.dashboardServerMdtState)
        .toEqual({
          name: 'app.dashboard.server.mdt',
          url: '/dashboard/server/:serverId/MDT/:targetId',
          controller: 'TargetDashboardController',
          controllerAs: 'targetDashboard',
          templateUrl: '/static/chroma_ui/source/iml/dashboard/assets/html/target-dashboard.js',
          params: {
            kind: {
              value: 'MDT',
              squash: true
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

  describe('dashboard server OST state', () => {
    it('should create the state', () => {
      expect(mod.dashboardServerOstState)
        .toEqual({
          name: 'app.dashboard.server.ost',
          url: '/dashboard/server/:serverId/OST/:targetId',
          controller: 'TargetDashboardController',
          controllerAs: 'targetDashboard',
          templateUrl: '/static/chroma_ui/source/iml/dashboard/assets/html/target-dashboard.js',
          params: {
            kind: {
              value: 'OST',
              squash: true
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

  describe('dashboard abstract fs state', () => {
    it('should create the state', () => {
      expect(mod.dashboardAbstractFsState)
        .toEqual({
          abstract: true,
          name: 'app.dashboard.fs',
          template: '<div ui-view></div>'
        });
    });
  });

  describe('dashboard fs state', () => {
    it('should create the state', () => {
      expect(mod.dashboardFsState)
        .toEqual({
          name: 'app.dashboard.fs.fsItem',
          url: '/dashboard/fs/:fsId',
          controller: 'BaseDashboardCtrl',
          controllerAs: 'baseDashboard',
          templateUrl: '/static/chroma_ui/source/iml/dashboard/assets/html/base-dashboard.js',
          resolve: {
            charts: 'baseDashboardChartResolves',
            fsStream: 'baseDashboardFsStream'
          }
        });
    });
  });

  describe('dashboard fs MDT state', () => {
    it('should create the state', () => {
      expect(mod.dashboardFsMdtState)
        .toEqual({
          name: 'app.dashboard.fs.mdt',
          url: '/dashboard/fs/:fsId/MDT/:targetId',
          controller: 'TargetDashboardController',
          controllerAs: 'targetDashboard',
          templateUrl: '/static/chroma_ui/source/iml/dashboard/assets/html/target-dashboard.js',
          params: {
            kind: {
              value: 'MDT',
              squash: true
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

  describe('dashboard fs OST state', () => {
    it('should create the state', () => {
      expect(mod.dashboardFsOstState)
        .toEqual({
          name: 'app.dashboard.fs.ost',
          url: '/dashboard/fs/:fsId/OST/:targetId',
          controller: 'TargetDashboardController',
          controllerAs: 'targetDashboard',
          templateUrl: '/static/chroma_ui/source/iml/dashboard/assets/html/target-dashboard.js',
          params: {
            kind: {
              value: 'OST',
              squash: true
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

});
