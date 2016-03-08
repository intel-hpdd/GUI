//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import _ from 'intel-lodash-mixins';

// $FlowIgnore: HTML templates that flow does not recognize.
import addServerModalTemplate from './assets/html/add-server-modal';

export function AddServerModalCtrl ($scope, $uibModalInstance, getAddServerManager,
                                    servers, step, getSpring) {
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

  /**
   * Opens the add server modal
   * @param {Object} [server]
   * @param {Object} [step]
   * @returns {Object}
   */
  return function openAddServerModal (server, step) {
    return $uibModal.open({
      templateUrl: addServerModalTemplate,
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
        step: _.fidentity(step)
      }
    });
  };
}

export function throwIfServerErrorsFactory () {
  'ngInject';

  /**
   * HOF. Will throw if a bulk server response has errors
   * or call the fn with the response.
   * @param {Function} fn
   * @returns {Function}
   */
  return function throwIfServerErrors (fn) {
    return function throwOrCall (response) {
      if (_.compact(response.errors).length)
        throw new Error(JSON.stringify(response.errors));

      return fn(response);
    };
  };
}