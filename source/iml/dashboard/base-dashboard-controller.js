// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

import type {
  Curry4
} from 'intel-fp';

import type {
  $scopeT
} from 'angular';

const STATES = Object.freeze({
  MONITORED: 'monitored',
  MANAGED: 'managed'
});

export default function BaseDashboardCtrl (
  $scope:$scopeT,
  fsB:Function,
  charts:Object[],
  propagateChange:Curry4<$scopeT,Object,string,Object,Object>
) {
  'ngInject';

  Object.assign(this, {
    fs: [],
    fsB,
    charts
  });

  fsB()
    .map(fp.map(x => ({
      ...x,
      STATES,
      state :x.immutable_state ? STATES.MONITORED : STATES.MANAGED
    })))
    .through(propagateChange($scope, this, 'fs'));

  $scope.$on('$destroy', () => {
    fsB.endBroadcast();
    fp.map(c => c.stream.destroy(), charts);
  });
}
