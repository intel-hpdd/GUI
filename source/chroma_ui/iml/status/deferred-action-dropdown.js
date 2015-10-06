//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2015 Intel Corporation All Rights Reserved.
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

angular.module('status')
  .controller('DeferredActionDropdownCtrl', function DeferredActionDropdownCtrl ($scope, socketStream, multiStream,
                                                     λ, localApply) {
    var ctrl = this;

    socketStream = fp.curry(2, socketStream);
    var getActions = fp.map(socketStream(fp.__, {
      jsonMask: 'resource_uri,available_actions,locks,id,label'
    }));
    var getMs = fp.flow(getActions, multiStream);

    ctrl.ms = λ();

    var setLoading = fp
      .lensProp('loading')
      .set(fp.__, ctrl);

    ctrl.onEnter = fp.once(function onEnter () {
      setLoading(true);

      var ms = getMs(ctrl.row.affected);

      ms.tap(setLoading.bind(null, false))
        .tap(localApply.bind(null, $scope))
        .pipe(ctrl.ms);

      $scope.$on('$destroy', ms.destroy.bind(ms));
    });
  })
  .directive('deferredActionDropdown', function deferredActionDropdown () {
    return {
      scope: {},
      bindToController: {
        row: '='
      },
      controller: 'DeferredActionDropdownCtrl',
      controllerAs: 'ctrl',
      templateUrl: 'iml/status/assets/html/deferred-action-dropdown.html'
    };
  });
