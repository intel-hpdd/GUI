//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@mfl/fp';

export default function ServerDashboardCtrl($scope, hostStream, charts) {
  'ngInject';
  const serverDashboard = Object.assign(this, {
    charts
  });

  hostStream.through(
    $scope.propagateChange.bind(null, $scope, serverDashboard, 'server')
  );

  $scope.$on('$destroy', () => {
    hostStream.destroy();
    fp.map(c => c.stream.destroy(), charts);
  });
}
