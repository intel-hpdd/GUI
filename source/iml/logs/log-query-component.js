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

export function controller(
  $scope: $scopeT,
  $location: $locationT,
  $stateParams: Object,
  qsStream: qsStreamT,
  propagateChange: Function
) {
  'ngInject';
  const p = propagateChange($scope, this, 'qs');
  const qs$ = qsStream($stateParams);

  qs$.map(x => x.qs).through(p);

  $scope.$on('$destroy', () => qs$.destroy());

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
  controller,
  template: `
<div class="row">
  <div class="col-xs-12">
    <parsely-box
      on-submit="::$ctrl.onSubmit(qs)"
      query="$ctrl.qs"
      parser-formatter="::$ctrl.parserFormatter"
      completer="::$ctrl.completer(value, cursorPosition)"
    ></parsely-box>
  </div>
</div>
  `
};
