// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { values } from "@iml/obj";
import getStore from "../store/get-store.js";
import global from "../global.js";
import extractApi from "@iml/extract-api";
import multiStream from "../multi-stream.js";

import { type FilesystemT } from "../file-system/file-system-reducer.js";
import { type TargetT } from "../target/target-reducer.js";

import { SHOW_COMMAND_MODAL_ACTION } from "../command/command-modal-reducer.js";

export default function ServerCtrl(
  $scope,
  $uibModal,
  pdshFilter,
  naturalSortFilter,
  serverActions,
  selectedServers,
  openAddServerModal,
  streams,
  localApply
) {
  "ngInject";
  $scope.server = {
    lnetConfigurationStream: streams.lnetConfigurationStream,
    jobMonitorStream: streams.jobMonitorStream,
    alertMonitorStream: streams.alertMonitorStream,
    maxSize: 10,
    itemsPerPage: 10,
    currentPage: 1,
    pdshFuzzy: false,
    hostnames: [],
    hostnamesHash: {},
    servers: [],
    activeServers: [],
    actions: serverActions,
    selectedServers: selectedServers.servers,
    toggleType: selectedServers.toggleType,
    transform(s, args) {
      const id = parseInt(args[0]);

      return s.map(xs => xs.filter(x => x.host_id === id)).sequence();
    },
    addServer() {
      $scope.server.addServerClicked = true;

      openAddServerModal().opened.then(() => {
        $scope.server.addServerClicked = false;
      });
    },
    continueAddingServer(record, step) {
      $scope.server.addServerClicked = true;

      openAddServerModal(record, step).opened.then(() => {
        $scope.server.addServerClicked = false;
      });
    },
    getFilteredHosts() {
      const filtered = pdshFilter(this.servers, this.hostnamesHash, this.getHostPath, this.pdshFuzzy);

      return naturalSortFilter(filtered, this.getHostPath, this.reverse);
    },
    getTotalItems() {
      // The total number of items is determined by the result
      // of the pdsh filter
      if (this.hostnames.length === 0) return this.servers.length;

      return this.getFilteredHosts().length;
    },
    pdshUpdate(expression, hostnames, hostnamesHash) {
      if (hostnames != null) {
        this.hostnames = hostnames;
        this.hostnamesHash = hostnamesHash;
        this.currentPage = 1;
        localApply($scope);
      }
    },
    getHostPath(item) {
      return item.address;
    },
    setPage(pageNum) {
      this.currentPage = pageNum;
    },
    getItemsPerPage() {
      return +this.itemsPerPage;
    },
    setItemsPerPage(num) {
      this.itemsPerPage = +num;
    },
    closeItemsPerPage() {
      this.itemsPerPageIsOpen = false;
    },
    getSortClass() {
      return this.inverse === true ? "fa-sort-asc" : "fa-sort-desc";
    },
    setEditable(editable) {
      $scope.server.editable = editable;
    },
    setEditName(name) {
      $scope.server.editName = name;
      $scope.server.setEditable(true);
    },
    getActionByValue(value) {
      return { ...serverActions.find(x => x.value === value) };
    },
    getSelectedHosts(value) {
      const action = this.getActionByValue(value);

      return this.getFilteredHosts()
        .filter(host => selectedServers.servers[host.fqdn])
        .filter(host => {
          if (!action.toggleDisabled) return true;

          return !action.toggleDisabled(host);
        })
        .map(host => ({ ...host }));
    },
    runAction(value) {
      const action = this.getActionByValue(value);
      const hosts = [...this.getSelectedHosts(value)];

      const modalInstance = $uibModal.open({
        template: `<div class="modal-header">
  <h3 class="modal-title">Run {{confirmServerActionModal.actionName}}</h3>
</div>
<div class="modal-body">
  <h5>{{confirmServerActionModal.actionName}} will be run for the following servers:</h5>
  <ul class="well">
    <li ng-repeat="host in confirmServerActionModal.hosts">
      {{host.address}}
    </li>
  </ul>
</div>
<div class="modal-footer">
  <div class="btn-group" uib-dropdown>
    <button type="button" ng-click="confirmServerActionModal.go()" class="btn btn-success" ng-disabled="confirmServerActionModal.inProgress">
      Go <i class="fa" ng-class="{'fa-spinner fa-spin': confirmServerActionModal.inProgress, 'fa-check-circle-o': !confirmServerActionModal.inProgress }"></i>
    </button>
    <button type="button" class="btn btn-success dropdown-toggle" uib-dropdown-toggle ng-disabled="confirmServerActionModal.inProgress">
      <span class="caret"></span>
      <span class="sr-only">Split button</span>
    </button>
    <ul class="dropdown-menu" role="menu">
      <li><a ng-click="confirmServerActionModal.go(true)">Go and skip command view</a></li>
    </ul>
  </div>
  <button class="btn btn-danger" ng-disabled="confirmServerActionModal.inProgress" ng-click="$dismiss('cancel')">Cancel <i class="fa fa-times-circle-o"></i></button>
</div>`,
        controller: "ConfirmServerActionModalCtrl",
        windowClass: "confirm-server-action-modal",
        keyboard: false,
        backdrop: "static",
        resolve: {
          action: () => action,
          hosts: () => hosts
        }
      });

      modalInstance.result.then(data => {
        $scope.server.setEditable(false);

        if (data == null) return;

        getStore.dispatch({
          type: SHOW_COMMAND_MODAL_ACTION,
          payload: [data]
        });
      });
    }
  };

  const onOpenAddServerModal = ({ detail: { record, step } }) => {
    $scope.server.continueAddingServer(record, step);
  };

  global.addEventListener("open_add_server_modal", onOpenAddServerModal);

  const p = $scope.propagateChange.bind(null, $scope, $scope.server);

  streams.serversStream.tap(selectedServers.addNewServers.bind(selectedServers)).through(p.bind(null, "servers"));

  streams
    .locksStream()
    .map((xs: LockT) => ({ ...xs }))
    .through(p.bind(null, "locks"));

  const getServers = (servers, filesystem: FilesystemT, targets: Array<TargetT>) =>
    targets
      .filter(
        t =>
          t.active_host != null &&
          (t.filesystem_id === filesystem.id || t.filesystems.find(x => x.id === filesystem.id) != null)
      )
      .map(t => parseInt(extractApi(t.active_host), 10))
      .filter(x => !isNaN(x))
      .map(hostId => servers.find(h => h.id === hostId));

  multiStream([streams.targetsStream, streams.fsStream])
    .map(([targets, filesystems]) => {
      const activeServers = filesystems
        .filter(fs => fs.state === "available" || fs.state === "unavailable")
        .map(fs => getServers($scope.server.servers, fs, targets))
        .map(xs => new Set(xs))
        .reduce((acc, curr) => {
          return new Set([...acc, ...curr]);
        }, new Set());

      return [...activeServers].filter(x => x != null).map(x => x.id);
    })
    .through(p.bind(null, "activeServers"));

  $scope.$on("$destroy", () => {
    values(streams).forEach(v => (v.destroy ? v.destroy() : v.endBroadcast()));
    global.removeEventListener("open_add_server_modal", onOpenAddServerModal);
  });
}
