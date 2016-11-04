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

import filterTargetByFs from '../target/filter-target-by-fs.js';
import filterTargetByHost from '../target/filter-target-by-host.js';

import type {
  $scopeT
} from 'angular';

import type {
  StateServiceT
} from 'angular-ui-router';

import type {
  qsStreamT
} from '../qs-stream/qs-stream-module.js';

import type {
  dashboardFsB,
  dashboardHostB,
  dashboardTargetB
} from './dashboard-resolves.js';

export default function DashboardCtrl (qsStream:qsStreamT, $scope:$scopeT, $state:StateServiceT,
  $stateParams:{kind:string}, fsB:dashboardFsB, hostsB:dashboardHostB, targetsB:dashboardTargetB,
  propagateChange:Function) {

  'ngInject';

  let targetSelectStream;

  const p = propagateChange($scope, this);

  const dashboard = Object.assign(this, {
    fs: {
      name: 'fs',
      selected: null,
      selectedTarget: null
    },
    host: {
      name: 'server',
      selected: null,
      selectedTarget: null
    },
    itemChanged (item) {
      if (targetSelectStream)
        targetSelectStream.destroy();

      if (!item.selected) {
        item.selectedTarget = dashboard.targets = null;
      } else {
        const filterBy = (dashboard.fs === item ? filterTargetByFs : filterTargetByHost);

        targetSelectStream = targetsB();
        targetSelectStream
          .through(filterBy(item.selected.id))
          .map(fp.filter((x) => x.kind !== 'MGT'))
          .through(p('targets'));
      }
    },
    onFilterView (item) {
      dashboard.onCancel();

      if (item.selectedTarget)
        $state.go(`app.dashboard.${item.selectedTarget.kind.toLowerCase()}`, {
          id: item.selectedTarget.id,
          resetState: true
        });
      else if (item.selected)
        $state.go(`app.dashboard.${item.name}`, {
          id: item.selected.id,
          resetState: true
        });
      else
        $state.go('app.dashboard.overview', {
          resetState: true
        });
    },
    onConfigure () {
      dashboard.configure = true;
    },
    onCancel () {
      dashboard.configure = false;
    }
  });

  fsB()
    .through(p('fileSystems'));

  hostsB()
    .through(p('hosts'));

  $scope.$on('$destroy', () => {
    fsB.endBroadcast();
    hostsB.endBroadcast();
    targetsB.endBroadcast();
    qs$.destroy();
  });

  const qs$ = qsStream($stateParams, {
    to: state => state.includes['app.dashboard']
  })
  .each(() => {
    if ($stateParams.kind === 'server')
      dashboard.type = dashboard.host;
    else
      dashboard.type = dashboard.fs;
  });
}
