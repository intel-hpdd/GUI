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


angular.module('hsm')
  .controller('HsmCtrl',
  function HsmCtrl($scope, openAddCopytoolModal,
                   copytoolStream, getCopytoolStream, copytoolOperationStream,
                   getAgentVsCopytoolStream) {

    var hsm = obj.merge(this, {
      stream: getAgentVsCopytoolStream({}, 10, 'minutes'),
      data: [],
      openAddModal: function openAddModal () {
        hsm.modalOpen = true;

        return openAddCopytoolModal($scope)
          .then(modalClosed, modalClosed);

        function modalClosed () {
          hsm.modalOpen = false;
        }
      }
    });

    var p = $scope.propagateChange($scope, hsm);

    p('copytools', copytoolStream);
    p('copytoolOperations', copytoolOperationStream);

    $scope.$on('$destroy', function onDestroy () {
      copytoolStream.destroy();
      copytoolOperationStream.destroy();
    });
  });
