//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import * as fp from 'intel-fp';

export default function ServerDashboardCtrl ($scope, hostStream, charts) {
  'ngInject';

  var serverDashboard = angular.extend(this, {
    charts
  });

  hostStream
    .through($scope.propagateChange($scope, serverDashboard, 'server'));

  $scope.$on('$destroy', () => {
    hostStream.destroy();
    fp.map(c => c.stream.destroy(), charts);
  });
}
