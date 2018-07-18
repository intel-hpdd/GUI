// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';

import filterTargetByFs from '../target/filter-target-by-fs.js';
import filterTargetByHost from '../target/filter-target-by-host.js';

import type { $scopeT } from 'angular';

import type { StateServiceT } from 'angular-ui-router';

import type { qsStreamT } from '../qs-stream/qs-stream-module.js';

import type { PropagateChange } from '../extend-scope-module.js';

import type { dashboardFsB, dashboardHostB, dashboardTargetB } from './dashboard-resolves.js';

export default function DashboardCtrl(
  qsStream: qsStreamT,
  $scope: $scopeT,
  $state: StateServiceT,
  $stateParams: { kind: string },
  fsB: dashboardFsB,
  hostsB: dashboardHostB,
  targetsB: dashboardTargetB,
  propagateChange: PropagateChange
) {
  'ngInject';
  let targetSelectStream;

  const p = propagateChange.bind(null, $scope, this);

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
    itemChanged(item) {
      if (targetSelectStream) targetSelectStream.destroy();

      if (!item.selected) {
        item.selectedTarget = dashboard.targets = null;
      } else {
        const filterBy = dashboard.fs === item ? filterTargetByFs : filterTargetByHost;

        targetSelectStream = targetsB();
        targetSelectStream
          .through(filterBy(item.selected.id))
          .map(fp.filter(x => x.kind !== 'MGT'))
          .through(p.bind(null, 'targets'));
      }
    },
    onFilterView(item) {
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
    onConfigure() {
      dashboard.configure = true;
    },
    onCancel() {
      dashboard.configure = false;
    }
  });

  fsB().through(p.bind(null, 'fileSystems'));

  hostsB().through(p.bind(null, 'hosts'));

  $scope.$on('$destroy', () => {
    fsB.endBroadcast();
    hostsB.endBroadcast();
    targetsB.endBroadcast();
    qs$.destroy();
  });

  const qs$ = qsStream($stateParams, {
    to: state => state.includes['app.dashboard']
  }).each(() => {
    if ($stateParams.kind === 'server') dashboard.type = dashboard.host;
    else dashboard.type = dashboard.fs;
  });
}
