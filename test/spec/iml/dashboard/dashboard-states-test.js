import { mock, resetAll } from '../../../system-mock.js';

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

  beforeEachAsync(async function() {
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
      },
      'source/iml/dashboard/assets/html/dashboard.html': {
        default: 'dashboardTemplate'
      },
      'source/iml/dashboard/assets/html/base-dashboard.html': {
        default: 'baseDashboardTemplate'
      },
      'source/iml/dashboard/assets/html/target-dashboard.html': {
        default: 'targetDashboardTemplate'
      },
      'source/iml/dashboard/assets/html/server-dashboard.html': {
        default: 'serverDashboardTemplate'
      }
    });
  });

  afterEach(resetAll);

  describe('dashboard state', () => {
    it('should create the state', () => {
      expect(mod.dashboardState).toEqual({
        name: 'app.dashboard',
        abstract: true,
        resolve: {
          fsB: 'dashboardFsB',
          hostsB: 'dashboardHostB',
          targetsB: 'dashboardTargetB'
        },
        data: {
          anonymousReadProtected: true,
          eulaState: true,
          helpPage: 'dashboard_charts.htm'
        },
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard',
        template: 'dashboardTemplate'
      });
    });
  });

  describe('dashboard overview state', () => {
    it('should create the state', () => {
      expect(mod.dashboardOverviewState).toEqual({
        name: 'app.dashboard.overview',
        url: '/dashboard',
        controller: 'BaseDashboardCtrl',
        controllerAs: 'baseDashboard',
        template: 'baseDashboardTemplate',
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
      expect(mod.dashboardServerState).toEqual({
        name: 'app.dashboard.server',
        url: '/dashboard/server/:id',
        controller: 'ServerDashboardCtrl',
        controllerAs: 'serverDashboard',
        template: 'serverDashboardTemplate',
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
          getData: ['hostsB', '$stateParams', expect.any(Function)]
        }
      });
    });
  });

  describe('dashboard MDT state', () => {
    it('should create the state', () => {
      expect(mod.dashboardMdtState).toEqual({
        name: 'app.dashboard.mdt',
        url: '/dashboard/MDT/:id',
        controller: 'TargetDashboardController',
        controllerAs: 'targetDashboard',
        template: 'targetDashboardTemplate',
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
          getData: ['targetsB', '$stateParams', expect.any(Function)]
        }
      });
    });
  });

  describe('dashboard OST state', () => {
    it('should create the state', () => {
      expect(mod.dashboardOstState).toEqual({
        name: 'app.dashboard.ost',
        url: '/dashboard/OST/:id',
        controller: 'TargetDashboardController',
        controllerAs: 'targetDashboard',
        template: 'targetDashboardTemplate',
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
          getData: ['targetsB', '$stateParams', expect.any(Function)]
        }
      });
    });
  });

  describe('dashboard fs state', () => {
    it('should create the state', () => {
      expect(mod.dashboardFsState).toEqual({
        name: 'app.dashboard.fs',
        url: '/dashboard/fs/:id',
        controller: 'BaseDashboardCtrl',
        controllerAs: 'baseDashboard',
        template: 'baseDashboardTemplate',
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
          getData: ['fsB', '$stateParams', expect.any(Function)]
        }
      });
    });
  });
});
