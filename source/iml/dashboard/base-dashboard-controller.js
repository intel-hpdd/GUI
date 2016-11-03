// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
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
