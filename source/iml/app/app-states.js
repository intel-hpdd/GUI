// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";

export const appState = {
  name: "app",
  url: "",
  redirectTo: "app.dashboard.overview",
  controller: "AppCtrl",
  controllerAs: "app",
  template: `<notification-slider stream="app.alertStream"></notification-slider>
<root-panel>
<nav class="navbar navbar-inverse" role="navigation">
  <div class="navbar-header">
    <button class="navbar-toggle" ng-click="app.isCollapsed = !app.isCollapsed">
      <i class="fa fa-bars"></i>
    </button>
    <a class="navbar-brand" ui-sref="app.dashboard.overview({resetState: true })">
      <div class="logo"></div>
    </a>
  </div>
  <div class="navbar-collapse" uib-collapse="app.isCollapsed">
    <ul class="nav navbar-nav">
      <li ui-sref-active="active">
        <a ui-sref="app.dashboard.overview({resetState: true })" id="dashboard-menu"><i class="fa fa-bar-chart-o"></i> Dashboard</a>
      </li>
      <li restrict-to="{{ app.GROUPS.FS_ADMINS }}" uib-dropdown>
        <a uib-dropdown-toggle href="#" id="configure-menu"><i class="fa fa-cog"></i> Configuration <i class="fa fa-caret-down"></i></a>
        <ul uib-dropdown-menu class="inverse-dropdown" role="menu" aria-labelledby="dropdownMenu">
          <li><a tabindex="-1" id="server-conf-item" ui-sref="app.server({ resetState: true })">Servers</a></li>
          <li><a tabindex="-1" id="power-conf-item" ui-sref="app.oldPower({ resetState: true })">Power Control</a></li>
          <li><a tabindex="-1" id="filesystem-conf-item" ui-sref="app.fileSystem({ resetState: true })">File Systems</a></li>
          <li><a tabindex="-1" id="hsm-conf-item" ui-sref="app.hsmFs.hsm({ resetState: true })">HSM</a></li>
          <li><a tabindex="-1" id="storage-conf-item" ui-sref="app.storage({ resetState: true })">Storage</a></li>
          <li><a tabindex="-1" id="user-conf-item" ui-sref="app.oldUser({ resetState: true })">Users</a></li>
          <li><a tabindex="-1" id="volume-conf-item" ui-sref="app.oldVolume({ resetState: true })">Volumes</a></li>
          <li><a tabindex="-1" id="mgt-conf-item" ui-sref="app.mgt({ resetState: true })">MGTs</a></li>
        </ul>
      </li>
      <li ui-sref-active="active">
        <a ui-sref="app.jobstats({
          resetState: true
        })" ui-sref-opts="{inherit: false}"><i class="fa fa-signal"></i> Jobstats</a>
      </li>
      <li ui-sref-active="active">
        <a id="log-menu" ui-sref="app.log.table({ resetState: true })"><i class="fa fa-book"></i> Logs</a>
      </li>
      <li help-mapper></li>
      <li>
        <a class="navigation status-nav" ng-href="{{ app.link }}">
          <span ng-class="app.status.health" class="ng-cloak badge notification-counter">
            {{ app.status.count }}<sup ng-if="app.status.aboveLimit">+</sup>
          </span> Status
        </a>
      </li>
    </ul>
    <ul class="nav navbar-nav navbar-right">
      <li command-monitor>
      </li>
      <li class="hidden-sm" restrict-to="{{ app.GROUPS.FS_ADMINS }}">
        <toggle-side-panel></toggle-side-panel>
      </li>
      <li ng-if="app.loggedIn" ui-sref-active="active">
        <a id="account" ui-sref="app.oldUserDetail({ id: app.user.id, resetState: true })">{{ app.user.username }}</a>
      </li>
      <li>
        <a class="login-toggle" ng-class="{login: !app.loggedIn, logout: app.loggedIn}" ng-click="app.onClick()">{{ app.loggedIn? 'Logout': 'Login' }}</a>
      </li>
    </ul>
  </div>
</nav>
<panels>
  <side-panel restrict-to="{{ app.GROUPS.FS_ADMINS }}">
    <h4 class="resource-heading page-header"><i class="fa fa-fw fa-sitemap" aria-hidden="true"></i>  Resources</h4>
    <tree-server-collection parent-id="0"></tree-server-collection>
    <tree-fs-collection parent-id="0"></tree-fs-collection>
  </side-panel>
  <slider-panel restrict-to="{{ app.GROUPS.FS_ADMINS }}"></slider-panel>
  <div class="main-panel">
    <page-title></page-title>
    <breadcrumb></breadcrumb>
    <ui-loader-view class="app-view view-container"></ui-loader-view>
    <footer class="text-center">
      <small>
        Integrated Manager for Lustre software {{ app.RUNTIME_VERSION }} is
        Copyright &copy; {{ app.COPYRIGHT_YEAR }} DDN. All rights reserved.
        <a ui-sref="app.about({ resetState: true })" class="navigation">About Integrated Manager for Lustre software</a>
        <a id="system-status" ui-sref="app.oldSystemStatus({ resetState: true })" restrict-to="{{ app.GROUPS.FS_ADMINS }}">System Status</a>
      </small>
    </footer>
  </div>
</panels>
</root-panel>`,
  resolve: {
    alertStream: ["appAlertStream", (x: Function) => x()],
    notificationStream: ["appNotificationStream", (x: Function) => x()],
    session: ["appSession", fp.identity]
  }
};
