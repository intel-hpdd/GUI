//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';

export default function HsmCtrl ($scope, openAddCopytoolModal, copytoolStream,
                                 copytoolOperationStream, agentVsCopytoolChart) {
  'ngInject';

  var hsm = angular.extend(this, {
    chart: agentVsCopytoolChart,
    openAddModal () {
      hsm.modalOpen = true;

      return openAddCopytoolModal($scope)
        .finally(() => hsm.modalOpen = false);
    }
  });

  var p = $scope.propagateChange($scope, hsm);

  p('copytools', copytoolStream);
  p('copytoolOperations', copytoolOperationStream);

  $scope.$on('$destroy', () => {
    agentVsCopytoolChart.stream.destroy();
    copytoolStream.destroy();
    copytoolOperationStream.destroy();
  });
}
