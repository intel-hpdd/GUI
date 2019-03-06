//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import getSpring from "../socket/get-spring.js";
import getStore from "../store/get-store.js";

export function AddServerModalCtrl($scope, $uibModalInstance, getAddServerManager, servers, step) {
  "ngInject";
  const manager = (this.manager = getAddServerManager());
  const spring = getSpring();

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

  let canEscape = true;
  const modalStack$ = getStore.select("modalStack");
  modalStack$.each((x: string[]) => {
    const [top] = [...x];

    canEscape = !top;
  });

  const onKeyPressed = (e: SyntheticKeyboardEvent<HTMLBodyElement>) => {
    if (e.key === "Escape" && canEscape) $scope.$emit("addServerModal::closeModal");
  };
  window.addEventListener("keydown", onKeyPressed);

  // Listen on the closeModal event from the step controllers
  $scope.$on("addServerModal::closeModal", $uibModalInstance.close);

  $scope.$on("$destroy", function cleanup() {
    manager.destroy();
    spring.destroy();
    modalStack$.end();
    window.removeEventListener("keydown", onKeyPressed);
  });
}

export function openAddServerModalFactory($uibModal) {
  "ngInject";
  return function openAddServerModal(server, step) {
    return $uibModal.open({
      template: `<step-container manager="addServer.manager"></step-container>`,
      controller: "AddServerModalCtrl as addServer",
      backdropClass: "add-server-modal-backdrop",
      backdrop: "static",
      keyboard: false,
      windowClass: "add-server-modal",
      resolve: {
        servers: function getServers() {
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
