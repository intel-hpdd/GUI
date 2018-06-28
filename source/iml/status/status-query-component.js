// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import statusQsToInputParser from './status-qs-to-input-parser.js';
import statusInputToQsParser from './status-input-to-qs-parser.js';
import statusCompleter from './status-completer.js';

import type { $scopeT, $locationT } from 'angular';

import type { PropagateChange } from '../extend-scope-module.js';

import type { qsStreamT } from '../qs-stream/qs-stream-module.js';

export function StatusQueryController(
  $scope: $scopeT & { tzPickerB: { endBroadcast: () => null } },
  $location: $locationT,
  qsStream: qsStreamT,
  propagateChange: PropagateChange,
  $stateParams: Object
) {
  'ngInject';
  const qs$ = qsStream($stateParams);
  const p = propagateChange.bind(null, $scope, this, 'qs');

  qs$.map(x => x.qs).through(p);

  this.$onDestroy = () => qs$.destroy();

  $scope.$on('$destroy', () => {
    this.tzPickerB.endBroadcast();
  });

  Object.assign(this, {
    parserFormatter: {
      parser: statusInputToQsParser,
      formatter: statusQsToInputParser
    },
    completer: statusCompleter,
    onSubmit: x => $location.search(x)
  });
}

export default {
  bindings: {
    tzPickerB: '<'
  },
  controller: StatusQueryController,
  template: `
  <div class="row">
    <div class="col-xs-12">
      <parsely-box
        on-submit="::$ctrl.onSubmit(qs)"
        query="$ctrl.qs"
        parser-formatter="::$ctrl.parserFormatter"
        completer="::$ctrl.completer(value, cursorPosition)"
      ></parsely-box>
      <common-status-searches></common-status-searches>
      <tz-picker stream="::$ctrl.tzPickerB"></tz-picker>
      <ui-loader-view class="status-table"></ui-loader-view>
    </div>
  </div>
`
};
