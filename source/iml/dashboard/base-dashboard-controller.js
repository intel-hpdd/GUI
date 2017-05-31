//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import * as fp from 'intel-fp';

export default function BaseDashboardCtrl ($scope, fsB, charts) {
  'ngInject';

  var baseDashboard = angular.extend(this, {
    fs: [],
    fsB,
    charts
  });

  var STATES = Object.freeze({
    MONITORED: 'monitored',
    MANAGED: 'managed'
  });

  fsB()
    .tap(fp.map(function setState (s) {
      s.STATES = STATES;
      s.state = (s.immutable_state ? STATES.MONITORED : STATES.MANAGED);
    }))
    .tap(x => baseDashboard.fs = x)
    .stopOnError(fp.curry(1, $scope.handleException))
    .each($scope.localApply.bind(null, $scope));

  $scope.$on('$destroy', () => {
    fsB.endBroadcast();
    fp.map(c => c.stream.destroy(), charts);
  });
}
