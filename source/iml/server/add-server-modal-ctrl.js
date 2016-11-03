//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import getSpring from '../socket/get-spring.js';

import addServerModalTemplate from './assets/html/add-server-modal.html!text';

export function AddServerModalCtrl ($scope, $uibModalInstance, getAddServerManager,
                                    servers, step) {
  'ngInject';

  var manager = this.manager = getAddServerManager();
  var spring = getSpring();

  step = step || manager.SERVER_STEPS.ADD;
  manager.start(step, {
    showCommand: false,
    data: {
      pdsh: (servers && servers.addresses[0]) || null,
      servers: servers,
      spring: spring
    }
  });

  manager.result.end.then($uibModalInstance.close);

  // Listen on the closeModal event from the step controllers
  $scope.$on('addServerModal::closeModal', $uibModalInstance.close);

  $scope.$on('$destroy', function cleanup () {
    manager.destroy();
    spring.destroy();
  });
}

export function openAddServerModalFactory ($uibModal) {
  'ngInject';

  return function openAddServerModal (server, step) {
    return $uibModal.open({
      template: addServerModalTemplate,
      controller: 'AddServerModalCtrl as addServer',
      backdropClass: 'add-server-modal-backdrop',
      backdrop: 'static',
      keyboard: 'false',
      windowClass: 'add-server-modal',
      resolve: {
        servers: function getServers () {
          if (server)
            return {
              auth_type: server.install_method,
              addresses: [server.address]
            };
        },
        step: () => step
      }
    });
  };
}
