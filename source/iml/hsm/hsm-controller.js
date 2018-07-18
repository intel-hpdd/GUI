//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function HsmCtrl(
  $scope,
  openAddCopytoolModal,
  copytoolStream,
  copytoolOperationStream,
  agentVsCopytoolChart
) {
  'ngInject';
  const hsm = Object.assign(this, {
    chart: agentVsCopytoolChart,
    openAddModal() {
      hsm.modalOpen = true;

      return openAddCopytoolModal($scope).finally(() => (hsm.modalOpen = false));
    }
  });

  const p = $scope.propagateChange.bind(null, $scope, hsm);

  p('copytools', copytoolStream);
  p('copytoolOperations', copytoolOperationStream);

  $scope.$on('$destroy', () => {
    agentVsCopytoolChart.stream.destroy();
    copytoolStream.destroy();
    copytoolOperationStream.destroy();
  });
}
