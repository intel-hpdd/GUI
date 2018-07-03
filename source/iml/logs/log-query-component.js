// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import logInputToQsParser from './log-input-to-qs-parser.js';
import logQsToInputParser from './log-qs-to-input-parser.js';
import logCompleter from './log-completer.js';

import type { $scopeT, $locationT } from 'angular';

import type { qsStreamT } from '../qs-stream/qs-stream-module.js';

import type { PropagateChange } from '../extend-scope-module.js';

export function controller(
  $scope: $scopeT,
  $location: $locationT,
  $stateParams: Object,
  qsStream: qsStreamT,
  propagateChange: PropagateChange
) {
  'ngInject';
  const p = propagateChange.bind(null, $scope, this, 'qs');
  const qs$ = qsStream($stateParams);

  qs$.map(x => x.qs).through(p);

  $scope.$on('$destroy', () => {
    qs$.destroy();
    this.tzPickerB.endBroadcast();
  });

  Object.assign(this, {
    parserFormatter: {
      parser: logInputToQsParser,
      formatter: logQsToInputParser
    },
    completer: logCompleter,
    onSubmit: $location.search.bind($location)
  });
}

export default {
  bindings: {
    tzPickerB: '<'
  },
  controller,
  template: `
  <div class="container log container-full">  
    <div class="row">
      <div class="col-xs-12">
        <parsely-box
          on-submit="::$ctrl.onSubmit(qs)"
          query="$ctrl.qs"
          parser-formatter="::$ctrl.parserFormatter"
          completer="::$ctrl.completer(value, cursorPosition)"
        ></parsely-box>
        <tz-picker stream="::$ctrl.tzPickerB"></tz-picker>
      </div>
    </div>
    <ui-loader-view class="log-table"></ui-loader-view>
  </div>
  `
};
