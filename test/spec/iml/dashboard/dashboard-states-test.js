import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('dashboard states', () => {
  let mod,
    dashboardFsB,
    dashboardHostB,
    dashboardTargetB,
    baseDashboardChartResolves,
    baseDashboardFsStream,
    serverDashboardChartResolves,
    serverDashboardHostStreamResolves,
    targetDashboardResolves,
    targetDashboardUsageStream,
    targetDashboardTargetStream;

  beforeEachAsync(async function () {
    dashboardFsB = 'dashboardFsB';
    dashboardHostB = 'dashboardHostB';
    dashboardTargetB = 'dashboardTargetB';
    baseDashboardChartResolves = 'baseDashboardChartResolves';
    baseDashboardFsStream = 'baseDashboardFsStream';
    serverDashboardChartResolves = 'serverDashboardChartResolves';
    serverDashboardHostStreamResolves = 'serverDashboardHostStreamResolves';
    targetDashboardResolves = 'targetDashboardResolves';
    targetDashboardUsageStream = 'targetDashboardUsageStream';
    targetDashboardTargetStream = 'targetDashboardTargetStream';

    mod = await mock('source/iml/dashboard/dashboard-states.js', {
      'source/iml/dashboard/dashboard-resolves.js': {
        dashboardFsB,
        dashboardHostB,
        dashboardTargetB
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
            fsB: 'dashboardFsB',
            hostsB: 'dashboardHostB',
            targetsB: 'dashboardTargetB'
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
          data: {
            kind: 'Dashboard',
            icon: 'fa-bar-chart-o'
          },
          resolve: {
            charts: 'baseDashboardChartResolves'
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
          data: {
            kind: 'Dashboard - Server',
            icon: 'fa-bar-chart-o'
          },
          resolve: {
            charts: 'serverDashboardChartResolves',
            hostStream: 'serverDashboardHostStreamResolves',
            getData: ['hostsB', '$stateParams', jasmine.any(Function)]
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
          data: {
            kind: 'Dashboard - MDT',
            icon: 'fa-bar-chart-o'
          },
          resolve: {
            charts: 'targetDashboardResolves',
            targetStream: 'targetDashboardTargetStream',
            usageStream: 'targetDashboardUsageStream',
            getData: ['targetsB', '$stateParams', jasmine.any(Function)]
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
            charts: 'targetDashboardResolves',
            targetStream: 'targetDashboardTargetStream',
            usageStream: 'targetDashboardUsageStream',
            getData: ['targetsB', '$stateParams', jasmine.any(Function)]
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
            charts: 'baseDashboardChartResolves',
            fsStream: 'baseDashboardFsStream',
            getData: ['fsB', '$stateParams', jasmine.any(Function)]
          }
        });
    });
  });
});
