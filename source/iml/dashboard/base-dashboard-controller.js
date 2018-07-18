// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';

import type { $scopeT } from 'angular';

import type { PropagateChange } from '../extend-scope-module.js';

const STATES = Object.freeze({
  MONITORED: 'monitored',
  MANAGED: 'managed'
});

export default function BaseDashboardCtrl(
  $scope: $scopeT,
  fsB: Function,
  charts: Object[],
  propagateChange: PropagateChange
) {
  'ngInject';
  Object.assign(this, {
    fs: [],
    fsB,
    charts
  });

  fsB()
    .map(
      fp.map(x => ({
        ...x,
        STATES,
        state: x.immutable_state ? STATES.MONITORED : STATES.MANAGED
      }))
    )
    .through(propagateChange.bind(null, $scope, this, 'fs'));

  $scope.$on('$destroy', () => {
    fsB.endBroadcast();
    charts.map(c => c.stream.destroy());
  });
}
