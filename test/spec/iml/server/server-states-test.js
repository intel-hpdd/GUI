describe("server states", () => {
  let serverState, serverDetailState, mockGroups, mockServerResolves, mockServerDetailResolves;

  beforeEach(() => {
    mockGroups = {
      SUPERUSERS: "superusers",
      FS_ADMINS: "filesystem_administrators",
      FS_USERS: "filesystem_users"
    };

    mockServerResolves = jest.fn();
    mockServerDetailResolves = jest.fn();
    mockServerDetailResolves.getData = jest.fn();

    jest.mock("../../../../source/iml/auth/authorization.js", () => ({
      GROUPS: mockGroups
    }));
    jest.mock("../../../../source/iml/server/server-resolves.js", () => mockServerResolves);
    jest.mock("../../../../source/iml/server/server-detail-resolves.js", () => mockServerDetailResolves);

    const mod = require("../../../../source/iml/server/server-states.js");

    serverState = mod.serverState;
    serverDetailState = mod.serverDetailState;
  });

  describe("server state", () => {
    it("should create the state", () => {
      expect(serverState).toEqual({
        name: "app.server",
        url: "/configure/server",
        controller: "ServerCtrl",
        template: `<div class="container container-full server-ctrl">
  <div class="no-servers well text-center" ng-if="server.servers.length === 0">
    <h1>No servers are configured</h1>
    <button type="button" class="add-server-button btn btn-success btn-lg"
            ng-click="::server.addServer()"
            ng-disabled="server.addServerClicked">
      <i class="fa fa-plus-circle"></i>Add Servers
    </button>
  </div>
  <div ng-if="server.servers.length > 0">
    <h4 class="section-header">Servers</h4>
    <ul class="list-inline">
      <li>
        <form name="pdshForm">
          <div class="form-group pdsh-input" ng-class="{'has-error': pdshForm.pdsh.$invalid, 'has-success': pdshForm.pdsh.$valid}">
            <div>
              <label>Filter by Hostname / Hostlist Expression</label>
              <span class="tooltip-container tooltip-hover">
                <i class="fa fa-question-circle">
                  <iml-tooltip size="'large'" direction="right">
                    <span>Enter a hostname / hostlist expression to filter the servers below.</span>
                  </iml-tooltip>
                </i>
              </span>
            </div>
            <pdsh pdsh-change="server.pdshUpdate(pdsh, hostnames, hostnamesHash)"></pdsh>
          </div>
          <button class="btn btn-info btn-sm fuzzy-filter" ng-model="server.pdshFuzzy" uib-btn-checkbox>
            <span ng-if="server.pdshFuzzy">
              Fuzzy
            </span>
            <span ng-if="!server.pdshFuzzy">
              Standard
            </span>
          </button>
        </form>
        <div class="btn-group entries" uib-dropdown is-open="server.itemsPerPageIsOpen">
          <button type="button" class="btn btn-info btn-sm" uib-dropdown-toggle ng-disabled="disabled">
            Entries: {{server.itemsPerPage}} <span class="caret"></span>
          </button>
          <ul uib-dropdown-menu role="menu">
            <li><a ng-click="server.setItemsPerPage(10); server.closeItemsPerPage();">10</a></li>
            <li><a ng-click="server.setItemsPerPage(25); server.closeItemsPerPage();">25</a></li>
            <li><a ng-click="server.setItemsPerPage(50); server.closeItemsPerPage();">50</a></li>
            <li><a ng-click="server.setItemsPerPage(100); server.closeItemsPerPage();">100</a></li>
          </ul>
        </div>
      </li>
    </ul>
    <table class="table server-table">
      <thead>
        <tr>
          <th>
            <a href=""
               ng-click="server.reverse = !server.reverse">
              Hostname <i class="fa" ng-class="{'fa-sort-asc': server.reverse, 'fa-sort-desc': !server.reverse}"></i>
            </a>
          </th>
          <th>Server State</th>
          <th>Profile</th>
          <th>LNet State</th>
          <th ng-if="!server.editable">Actions</th>
          <th ng-if="server.editable" class="select-server-header">Select Server</th>
        </tr>
      </thead>
      <tbody>
        <tr ng-repeat="item in server.servers | pdsh:server.hostnamesHash:server.getHostPath:server.pdshFuzzy | naturalSort:server.getHostPath:server.reverse | paginate:server.currentPage-1:server.getItemsPerPage() track by item.id">
          <td>
            <a route-to="{{ 'configure/server/' + item.id }}">
              <span>{{ ::item.address }}</span>
            </a>
          </td>
          <td>
            <record-state display-type="'medium'" record-id="::item.resource_uri" alert-stream="::server.alertMonitorStream"></record-state>
            <job-status record-id="::item.resource_uri" job-stream="::server.jobMonitorStream"></job-status>
          </td>
          <td>
            <span>{{ item.server_profile.ui_name }}</span>
          </td>
          <td class="lnet-state">
            <span as-viewer stream="::server.lnetConfigurationStream" args="[item.resource_uri]" transform="::server.transform(stream, args)">
              <lnet-status stream="::viewer"></lnet-status>
            </span>
            <span as-viewer stream="::server.lnetConfigurationStream" args="[item.resource_uri]" transform="::server.transform(stream, args)">
              <span as-value stream="::viewer">
                <record-state record-id="::curr.val.resource_uri" alert-stream="::server.alertMonitorStream"></record-state>
              </span>
            </span>
          </td>
          <td ng-if="!server.editable" as-stream val="item">
            <action-dropdown stream="::str" override-click="true"></action-dropdown>
          </td>
          <td ng-if="server.editable" class="select-server">
            <button ng-if="!server.getActionByValue(server.editName).toggleDisabled(item)"
                    class="btn btn-info btn-sm"
                    ng-model="server.selectedServers[item.fqdn]"
                    uib-btn-checkbox>
              <span ng-if="server.selectedServers[item.fqdn]">
                <i class="fa fa-check"></i> Selected
              </span>
              <span ng-if="!server.selectedServers[item.fqdn]">
                Unselected
              </span>
            </button>
            <span ng-if="server.getActionByValue(server.editName).toggleDisabled(item)"
              class="disabled tooltip-container tooltip-hover">
              <a type="button" class="disabled btn btn-default btn-sm">
                Disabled
                <iml-tooltip size="'large'" direction="left">
                  <span>{{ server.getActionByValue(server.editName).toggleDisabledReason(item) }}</span>
                </iml-tooltip>
              </a>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="text-center">
      <uib-pagination total-items="server.getTotalItems()"
                      items-per-page="server.getItemsPerPage()"
                      ng-model="server.currentPage"
                      max-size="server.maxSize"
                      class="pagination-sm"
                      boundary-links="true"
                      ng-show="server.getTotalItems() > server.getItemsPerPage()">
      </uib-pagination>
    </div>

    <button ng-if="!server.editable"
            ng-disabled="server.addServerClicked"
            ng-click="server.addServer()"
            type="button"
            class="btn btn-default add-server-button btn-sm">
      <i class="fa fa-plus-circle text-success"></i> Add More Servers
    </button>

    <div class="edit-buttons" ng-if="server.editable">
      <div class="btn-group btn-group-justified btn-block">
        <a type="button" ng-click="server.toggleType('all')" ng-model="server.selectType" uib-btn-radio="'all'" class="btn btn-info btn-lg">Select All</a>
        <a type="button" ng-click="server.toggleType('none')" ng-model="server.selectType" uib-btn-radio="'none'" class="btn btn-info btn-lg">Select None</a>
        <a type="button" ng-click="server.toggleType('invert')" ng-model="server.selectType"  uib-btn-radio="'invert'" class="btn btn-info btn-lg">Invert Selection</a>
      </div>
      <div class="tooltip-container tooltip-hover">
        <button ng-disabled="server.getSelectedHosts(server.editName).length === 0"
                ng-click="server.runAction(server.editName)"
                class="btn btn-success btn-lg btn-block">
          {{ server.editName }} <i class="fa fa-check-circle-o"></i>
        </button>

        <help-tooltip size="'large'" topic="{{server.getActionByValue(server.editName).helpTopic}}" direction="top"></help-tooltip>

      </div>
      <button class="btn btn-danger btn-lg btn-block" ng-click="server.setEditable(false)">
        Cancel <i class="fa fa-times-circle-o"></i>
      </button>
    </div>

    <h4 class="section-header">Server Actions</h4>

    <div class="action-buttons">
      <span class="tooltip-container tooltip-hover" ng-repeat="action in server.actions track by action.value">
        <a type="button" class="btn btn-primary btn-sm"
           ng-class="{disabled: action.buttonDisabled(server.servers)}"
           ng-click="server.setEditName(action.value)">
          {{action.value}}
          <i class="fa fa-question-circle">
            <iml-tooltip size="'medium'" direction="top">
              <span>{{ action.buttonTooltip(server.servers) }}</span>
            </iml-tooltip>
          </i>
        </a>
      </span>
    </div>
  </div>
</div>`,
        params: {
          resetState: {
            dynamic: true
          }
        },
        data: {
          helpPage: "Graphical_User_Interface_9_0.html#9.3.1",
          access: mockGroups.FS_ADMINS,
          anonymousReadProtected: true,
          kind: "Servers",
          icon: "fa-tasks"
        },
        resolve: {
          streams: expect.any(Function)
        }
      });
    });
  });

  describe("server detail state", () => {
    it("should create the state", () => {
      expect(serverDetailState).toEqual({
        name: "app.serverDetail",
        url: "/configure/server/:id",
        controller: "ServerDetailController",
        controllerAs: "serverDetail",
        template: `<div class="server-detail-ctrl">
  <div ng-if="!serverDetail.server" class="well text-center">
    <h1>Server Not Found</h1>
    <a route-to="configure/server/">&larr; Return to Server Screen</a>
  </div>
  <div ng-if="serverDetail.server" class="container container-full">
    <div class="detail-panel">
      <h4 class="section-header">Server Detail</h4>
      <div class="detail-row">
        <div>Address:</div>
        <div>{{ ::serverDetail.server.address }}</div>
      </div>
      <div class="detail-row">
        <div>State:</div>
        <div>{{ ::serverDetail.server.state }}</div>
      </div>
      <div class="detail-row">
        <div>FQDN:</div>
        <div>{{ ::serverDetail.server.fqdn }}</div>
      </div>
      <div class="detail-row">
        <div>Nodename:</div>
        <div>{{ ::serverDetail.server.nodename }}</div>
      </div>
      <div class="detail-row">
        <div>Profile:</div>
        <div>{{serverDetail.server.server_profile.ui_name}}</div>
      </div>
      <div class="detail-row">
        <div>Boot time:</div>
        <div>{{serverDetail.server.boot_time | date:'EEEE, MMMM d, y HH:mm:ss'}}
        </div>
      </div>
      <div class="detail-row">
        <div>State changed:</div>
        <div>{{serverDetail.server.state_modified_at | date:'EEEE, MMMM d, y HH:mm:ss'}}
        </div>
      </div>
      <div class="detail-row">
        <div>Alerts:</div>
        <div>
          <record-state record-id="serverDetail.server.resource_uri" alert-stream="serverDetail.alertMonitorStream" display-type="'medium'"></record-state>
          <job-status record-id="serverDetail.server.resource_uri" job-stream="serverDetail.jobMonitorStream"></job-status>
        </div>
      </div>
      <div as-stream val="serverDetail.server">
        <action-dropdown tooltip-placement="top" stream="::str" override-click="true"></action-dropdown>
      </div>
    </div>
    <configure-pacemaker stream="::serverDetail.pacemakerConfigurationStream" alert-stream="::serverDetail.alertMonitorStream" job-stream="::serverDetail.jobMonitorStream"></configure-pacemaker>
    <configure-corosync stream="::serverDetail.corosyncConfigurationStream" alert-stream="::serverDetail.alertMonitorStream" job-stream="::serverDetail.jobMonitorStream"></configure-corosync>
    <div ng-if="serverDetail.lnetConfiguration" class="detail-panel">
      <h4 class="section-header">LNet Detail</h4>
      <div class="detail-row">
        <div>
          State:
        </div>
        <div as-viewer stream="::serverDetail.lnetConfigurationStream">
          <lnet-status stream="::viewer"></lnet-status>
        </div>
      </div>
      <div class="detail-row">
        <div>Alerts:</div>
        <div>
          <record-state record-id="serverDetail.lnetConfiguration.resource_uri" alert-stream="::serverDetail.alertMonitorStream" display-type="'medium'"></record-state>
          <job-status record-id="serverDetail.lnetConfiguration.resource_uri" job-stream="::serverDetail.jobMonitorStream"></job-status>
        </div>
      </div>
      <div as-viewer stream="::serverDetail.lnetConfigurationStream">
        <action-dropdown tooltip-placement="top" stream="::viewer"></action-dropdown>
      </div>
    </div>
    <configure-lnet network-interface-stream="::serverDetail.networkInterfaceStream" active-fs-member="serverDetail.server.member_of_active_filesystem"></configure-lnet>
  </div>
</div>`,
        params: {
          resetState: {
            dynamic: true
          }
        },
        data: {
          helpPage: "Graphical_User_Interface_9_0.html#9.3.1.1",
          access: mockGroups.FS_ADMINS,
          anonymousReadProtected: true,
          kind: "Server Detail",
          icon: "fa-tasks"
        },
        resolve: {
          streams: expect.any(Function),
          getData: expect.any(Function)
        }
      });
    });
  });
});
