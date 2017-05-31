//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {values} from 'intel-obj';
import {filter, eqFn, identity, view, flow,
  lensProp, always, find} from 'intel-fp';

import getCommandStream from '../command/get-command-stream.js';

const viewLens = flow(lensProp, view);

// $FlowIgnore: HTML templates that flow does not recognize.
import confirmServerActionModalTemplate from './assets/html/confirm-server-action-modal.html!text';

export default function ServerCtrl ($scope, $uibModal, pdshFilter, naturalSortFilter,
                                    serverActions, selectedServers, openCommandModal,
                                    openAddServerModal, overrideActionClick, streams) {
  'ngInject';

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
    actions: serverActions,
    selectedServers: selectedServers.servers,
    toggleType: selectedServers.toggleType,
    transform (s, args) {
      const resourceUri = args[0];
      const eqHost = eqFn(identity, viewLens('host'), resourceUri);

      return s
        .map(filter(eqHost))
        .sequence();
    },
    addServer () {
      $scope.server.addServerClicked = true;

      openAddServerModal().opened
        .then(() => {
          $scope.server.addServerClicked = false;
        });
    },
    getFilteredHosts () {
      var filtered = pdshFilter(this.servers, this.hostnamesHash, this.getHostPath, this.pdshFuzzy);

      return naturalSortFilter(filtered, this.getHostPath, this.reverse);
    },
    getTotalItems () {
      // The total number of items is determined by the result
      // of the pdsh filter
      if (this.hostnames.length === 0)
        return this.servers.length;

      return this.getFilteredHosts().length;
    },
    pdshUpdate (expression, hostnames, hostnamesHash) {
      if (hostnames != null) {
        this.hostnames = hostnames;
        this.hostnamesHash = hostnamesHash;
        this.currentPage = 1;
      }
    },
    getHostPath (item) {
      return item.address;
    },
    setPage (pageNum) {
      this.currentPage = pageNum;
    },
    getItemsPerPage () {
      return +this.itemsPerPage;
    },
    setItemsPerPage (num) {
      this.itemsPerPage = +num;
    },
    closeItemsPerPage () {
      this.itemsPerPageIsOpen = false;
    },
    getSortClass () {
      return this.inverse === true ? 'fa-sort-asc' : 'fa-sort-desc';
    },
    setEditable (editable) {
      $scope.server.editable = editable;
    },
    setEditName (name) {
      $scope.server.editName = name;
      $scope.server.setEditable(true);
    },
    getActionByValue (value) {
      const eqValue = eqFn(identity, viewLens('value'), value);
      return find(eqValue, serverActions);
    },
    getSelectedHosts (value) {
      var action = this.getActionByValue(value);


      return this.getFilteredHosts()
        .filter((host) => selectedServers.servers[host.fqdn])
        .filter((host) => {
          if (!action.toggleDisabled)
            return true;

          return !action.toggleDisabled(host);
        });
    },
    runAction (value) {
      var action = this.getActionByValue(value);
      var hosts = this.getSelectedHosts(value);

      var modalInstance = $uibModal.open({
        template: confirmServerActionModalTemplate,
        controller: 'ConfirmServerActionModalCtrl',
        windowClass: 'confirm-server-action-modal',
        keyboard: false,
        backdrop: 'static',
        resolve: {
          action: always(action),
          hosts: always(hosts)
        }
      });

      modalInstance.result
        .then((data) => {
          $scope.server.setEditable(false);

          if (data == null)
            return;

          const commandStream = getCommandStream([data]);
          openCommandModal(commandStream).result
            .then(commandStream.destroy.bind(commandStream));
        });
    },
    overrideActionClick
  };

  const p = $scope.propagateChange($scope, $scope.server, 'servers');

  streams.serversStream
    .tap(selectedServers.addNewServers.bind(selectedServers))
    .through(p);

  $scope.$on('$destroy', () => {
    values(streams)
      .forEach((v) => v.destroy ? v.destroy() : v.endBroadcast());
  });
}
