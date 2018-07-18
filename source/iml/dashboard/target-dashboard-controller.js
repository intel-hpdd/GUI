//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';

export default function TargetDashboardController($scope, $stateParams, charts, targetStream, usageStream) {
  'ngInject';
  const targetDashboard = Object.assign(this, {
    charts,
    usageStream,
    kind: $stateParams.kind
  });

  targetStream.through($scope.propagateChange.bind(null, $scope, targetDashboard, 'target'));

  $scope.$on('$destroy', () => {
    targetStream.destroy();
    usageStream.endBroadcast();
    fp.map(c => c.stream.destroy())(charts);
  });
}
