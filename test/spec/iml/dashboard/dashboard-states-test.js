import highland from 'highland';

describe('dashboard states', () => {
  let mod,
    mockDashboardFsB,
    mockDashboardHostB,
    mockDashboardTargetB,
    mockBaseDashboardChartResolves,
    mockBaseDashboardFsStream,
    mockServerDashboardChartResolves,
    mockServerDashboardHostStreamResolves,
    mockTargetDashboardResolves,
    mockTargetDashboardUsageStream,
    mockTargetDashboardTargetStream;

  beforeEach(() => {
    mockDashboardFsB = 'dashboardFsB';
    mockDashboardHostB = 'dashboardHostB';
    mockDashboardTargetB = 'dashboardTargetB';
    mockBaseDashboardChartResolves = 'baseDashboardChartResolves';
    mockBaseDashboardFsStream = 'baseDashboardFsStream';
    mockServerDashboardChartResolves = 'serverDashboardChartResolves';
    mockServerDashboardHostStreamResolves = 'serverDashboardHostStreamResolves';
    mockTargetDashboardResolves = 'targetDashboardResolves';
    mockTargetDashboardUsageStream = 'targetDashboardUsageStream';
    mockTargetDashboardTargetStream = 'targetDashboardTargetStream';

    jest.mock('../../../../source/iml/dashboard/dashboard-resolves.js', () => ({
      dashboardFsB: mockDashboardFsB,
      dashboardHostB: mockDashboardHostB,
      dashboardTargetB: mockDashboardTargetB
    }));

    jest.mock('../../../../source/iml/dashboard/base-dashboard-chart-resolves.js', () => ({
      baseDashboardChartResolves: mockBaseDashboardChartResolves,
      baseDashboardFsStream: mockBaseDashboardFsStream
    }));

    jest.mock('../../../../source/iml/dashboard/server-dashboard-resolves.js', () => ({
      serverDashboardChartResolves: mockServerDashboardChartResolves,
      serverDashboardHostStreamResolves: mockServerDashboardHostStreamResolves
    }));

    jest.mock('../../../../source/iml/dashboard/target-dashboard-resolves.js', () => ({
      targetDashboardResolves: mockTargetDashboardResolves,
      targetDashboardUsageStream: mockTargetDashboardUsageStream,
      targetDashboardTargetStream: mockTargetDashboardTargetStream
    }));

    mod = require('../../../../source/iml/dashboard/dashboard-states.js');
  });

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
          helpPage: 'Graphical_User_Interface_9_0.html#9.1'
        },
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard',
        template: `<div class="container container-full dashboard-container">
  <div class="row">
    <div class="col-xs-12">
      <button class="btn btn-block btn-sm btn-primary configure-dashboard" ng-if="!dashboard.configure" ng-click="dashboard.onConfigure()">Configure Dashboard<i class="fa fa-cog"></i></button>

      <div class="well well-lg configure-dashboard-well" ng-if="dashboard.configure">
        <form name="form">
          <div class="form-group">
            <label>Choose Type
              <span class="tooltip-container tooltip-hover">
                <a><i class="fa fa-question-circle"></i></a>
                <help-tooltip topic="dashboard_filter_type" direction="right" size="'medium'"></help-tooltip>
              </span>
            </label>
            <div class="btn-group btn-group-justified">
              <div class="btn-group">
                <button type="button" class="btn btn-primary" ng-model="dashboard.type" uib-btn-radio="dashboard.fs" ng-click="dashboard.itemChanged(dashboard.fs)">File System</button>
              </div>
              <div class="btn-group">
                <button type="button" class="btn btn-primary" ng-model="dashboard.type" uib-btn-radio="dashboard.host" ng-click="dashboard.itemChanged(dashboard.host)">Server</button>
              </div>
            </div>
          </div>

          <div ng-if="dashboard.type === dashboard.fs">
            <div class="form-group">
              <label>File System
                <span class="tooltip-container tooltip-hover">
                  <a><i class="fa fa-question-circle"></i></a>
                  <help-tooltip topic="dashboard_filter_fs" direction="right" size="'large'"></help-tooltip>
                </span>
              </label>
              <select class="form-control"
                      ng-model="dashboard.fs.selected"
                      ng-options="item.label for item in dashboard.fileSystems track by item.id"
                      ng-change="dashboard.itemChanged(dashboard.fs)">
                <option value="">All File Systems</option>
              </select>
            </div>
          </div>

          <div ng-if="dashboard.type === dashboard.host">
            <div class="form-group">
              <label>Server
                <span class="tooltip-container tooltip-hover">
                  <a><i class="fa fa-question-circle"></i></a>
                  <help-tooltip topic="dashboard_filter_server" direction="right" size="'large'"></help-tooltip>
                </span>
              </label>
              <select class="form-control"
                      ng-model="dashboard.host.selected"
                      ng-options="item.label for item in dashboard.hosts track by item.id"
                      ng-change="dashboard.itemChanged(dashboard.host)">
                <option value="">All Servers</option>
              </select>
            </div>
          </div>

          <div class="form-group" ng-if="dashboard.targets.length">
            <label>Target
              <span class="tooltip-container tooltip-hover">
                <a><i class="fa fa-question-circle"></i></a>
                <help-tooltip topic="dashboard_filter_target" direction="right" size="'medium'"></help-tooltip>
              </span>
            </label>
            <select
              class="form-control"
              ng-model="dashboard.type.selectedTarget"
              ng-options="target.label for target in dashboard.targets track by target.id">
              <option value="">All Targets</option>
            </select>
          </div>
          <button type="submit" ng-click="dashboard.onFilterView(dashboard.type)" class="btn btn-success btn-block">Update</button>
          <button ng-click="dashboard.onCancel()" class="btn btn-cancel btn-block">Cancel</button>
        </form>
      </div>
    </div>
  </div>
  <ui-loader-view class="section-top-margin"></ui-loader-view>
</div>`
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
        template: `<h4 class="section-header">File Systems</h4>
<div class="row dashboard-info">
  <div class="col-lg-12">
    <table class="table table-condensed">
      <thead>
        <tr>
          <th>File System</th>
          <th>Type</th>
          <th>Space Used / Total</th>
          <th>Files Used / Total</th>
          <th>Clients</th>
        </tr>
      </thead>
      <tbody>
        <tr ng-repeat="fs in baseDashboard.fs track by fs.id">
          <td restrict-to="{{ app.GROUPS.FS_ADMINS }}">
            <a route-to="configure/filesystem/{{fs.id}}/">{{ fs.name }}</a>
          </td>
          <td restrict="{{ app.GROUPS.FS_ADMINS }}">{{ fs.name }}</td>
          <td>
            {{ fs.state }}
            <span class="tooltip-container tooltip-hover">
              <a><i class="fa fa-question-circle"></i></a>
                <help-tooltip ng-if="fs.state === fs.STATES.MANAGED" topic="managed_filesystem" direction="right" size="'large'"></help-tooltip>
                <help-tooltip ng-if="fs.state === fs.STATES.MONITORED" topic="monitored_filesystem" direction="right" size="'large'"></help-tooltip>
            </span>
          </td>
          <td as-viewer stream="baseDashboard.fsB">
            <usage-info stream="viewer" id="fs.id" prefix="bytes"></usage-info>
          </td>
          <td as-viewer stream="baseDashboard.fsB">
            <usage-info stream="viewer" id="fs.id" prefix="files"></usage-info>
          </td>
          <td>{{ fs.client_count }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<h4 class="section-header">Charts</h4>
<charts-container charts="baseDashboard.charts"></charts-container>`,
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
        template: `<h4 class="section-header">Server: {{serverDashboard.server.label}}</h4>

<h4 class="section-header">Charts</h4>
<charts-container charts="serverDashboard.charts"></charts-container>`,
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

  describe('getDataFn', () => {
    let s$, $stateParams, result;
    beforeEach(() => {
      s$ = highland();
      $stateParams = {
        id: 1
      };

      result = mod.dashboardServerState.resolve.getData[2](() => s$, $stateParams);
    });

    it('should pass in the label when present', async () => {
      s$.write([{ id: 1, label: 'good' }, { id: 2, label: 'bad' }]);
      expect(await result).toEqual({ label: 'good' });
    });

    it('should pass an empty label when not present', async () => {
      s$.write([{ id: 2 }]);
      expect(await result).toEqual({ label: '' });
    });
  });

  describe('dashboard MDT state', () => {
    it('should create the state', () => {
      expect(mod.dashboardMdtState).toEqual({
        name: 'app.dashboard.mdt',
        url: '/dashboard/MDT/:id',
        controller: 'TargetDashboardController',
        controllerAs: 'targetDashboard',
        template: `<h4 class="section-header">{{ targetDashboard.kind }}: {{targetDashboard.target.label}}</h4>
<div class="row dashboard-info">
  <div class="col-lg-12">
    <table class="table table-condensed">
      <thead>
        <tr>
          <th>Name</th>
          <th>Active Host</th>
          <th>File System</th>
          <th>Space Free / Total</th>
          <th>{{ targetDashboard.kind === 'MDT' ? 'Files' : 'Objects' }}  Used / Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td restrict-to="{{ app.GROUPS.FS_ADMINS }}">
            <a route-to="target/{{targetDashboard.target.id}}">{{ targetDashboard.target.label }}</a>
          </td>
          <td restrict="{{ app.GROUPS.FS_ADMINS }}"> {{targetDashboard.target.label}} </td>
          <td ng-switch on="targetDashboard.target.active_host" restrict-to="{{ app.GROUPS.FS_ADMINS }}">
            <span ng-switch-when="null">{{ targetDashboard.target.active_host_name }}</span>
            <a ng-switch-default route-to="configure/server/{{targetDashboard.target.active_host | extractApi}}">{{ targetDashboard.target.active_host_name }}</a>
          </td>
          <td restrict="{{ app.GROUPS.FS_ADMINS }}">{{ targetDashboard.target.active_host_name }}</td>
          <td restrict-to="{{ app.GROUPS.FS_ADMINS }}">
            <a route-to="configure/filesystem/{{targetDashboard.target.filesystem_id}}">{{ targetDashboard.target.filesystem_name }}</a>
          </td>
          <td restrict="{{ app.GROUPS.FS_ADMINS }}">{{targetDashboard.target.filesystem_name}}</td>
          <td as-viewer stream="targetDashboard.usageStream">
            <usage-info stream="viewer" prefix="bytes"></usage-info>
          </td>
          <td as-viewer stream="targetDashboard.usageStream">
            <usage-info stream="viewer" prefix="files"></usage-info>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<h4 class="section-header">Charts</h4>

<charts-container charts="targetDashboard.charts"></charts-container>`,
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
        template: `<h4 class="section-header">{{ targetDashboard.kind }}: {{targetDashboard.target.label}}</h4>
<div class="row dashboard-info">
  <div class="col-lg-12">
    <table class="table table-condensed">
      <thead>
        <tr>
          <th>Name</th>
          <th>Active Host</th>
          <th>File System</th>
          <th>Space Free / Total</th>
          <th>{{ targetDashboard.kind === 'MDT' ? 'Files' : 'Objects' }}  Used / Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td restrict-to="{{ app.GROUPS.FS_ADMINS }}">
            <a route-to="target/{{targetDashboard.target.id}}">{{ targetDashboard.target.label }}</a>
          </td>
          <td restrict="{{ app.GROUPS.FS_ADMINS }}"> {{targetDashboard.target.label}} </td>
          <td ng-switch on="targetDashboard.target.active_host" restrict-to="{{ app.GROUPS.FS_ADMINS }}">
            <span ng-switch-when="null">{{ targetDashboard.target.active_host_name }}</span>
            <a ng-switch-default route-to="configure/server/{{targetDashboard.target.active_host | extractApi}}">{{ targetDashboard.target.active_host_name }}</a>
          </td>
          <td restrict="{{ app.GROUPS.FS_ADMINS }}">{{ targetDashboard.target.active_host_name }}</td>
          <td restrict-to="{{ app.GROUPS.FS_ADMINS }}">
            <a route-to="configure/filesystem/{{targetDashboard.target.filesystem_id}}">{{ targetDashboard.target.filesystem_name }}</a>
          </td>
          <td restrict="{{ app.GROUPS.FS_ADMINS }}">{{targetDashboard.target.filesystem_name}}</td>
          <td as-viewer stream="targetDashboard.usageStream">
            <usage-info stream="viewer" prefix="bytes"></usage-info>
          </td>
          <td as-viewer stream="targetDashboard.usageStream">
            <usage-info stream="viewer" prefix="files"></usage-info>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<h4 class="section-header">Charts</h4>

<charts-container charts="targetDashboard.charts"></charts-container>`,
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
        template: `<h4 class="section-header">File Systems</h4>
<div class="row dashboard-info">
  <div class="col-lg-12">
    <table class="table table-condensed">
      <thead>
        <tr>
          <th>File System</th>
          <th>Type</th>
          <th>Space Used / Total</th>
          <th>Files Used / Total</th>
          <th>Clients</th>
        </tr>
      </thead>
      <tbody>
        <tr ng-repeat="fs in baseDashboard.fs track by fs.id">
          <td restrict-to="{{ app.GROUPS.FS_ADMINS }}">
            <a route-to="configure/filesystem/{{fs.id}}/">{{ fs.name }}</a>
          </td>
          <td restrict="{{ app.GROUPS.FS_ADMINS }}">{{ fs.name }}</td>
          <td>
            {{ fs.state }}
            <span class="tooltip-container tooltip-hover">
              <a><i class="fa fa-question-circle"></i></a>
                <help-tooltip ng-if="fs.state === fs.STATES.MANAGED" topic="managed_filesystem" direction="right" size="'large'"></help-tooltip>
                <help-tooltip ng-if="fs.state === fs.STATES.MONITORED" topic="monitored_filesystem" direction="right" size="'large'"></help-tooltip>
            </span>
          </td>
          <td as-viewer stream="baseDashboard.fsB">
            <usage-info stream="viewer" id="fs.id" prefix="bytes"></usage-info>
          </td>
          <td as-viewer stream="baseDashboard.fsB">
            <usage-info stream="viewer" id="fs.id" prefix="files"></usage-info>
          </td>
          <td>{{ fs.client_count }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<h4 class="section-header">Charts</h4>
<charts-container charts="baseDashboard.charts"></charts-container>`,
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
          getData: ['fsB', '$stateParams', expect.any(Function)]
        }
      });
    });
  });
});
