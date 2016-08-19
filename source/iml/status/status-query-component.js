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

import statusQsToInputParser from './status-qs-to-input-parser.js';
import statusInputToQsParser from './status-input-to-qs-parser.js';
import statusCompleter from './status-completer.js';

import type {
  $scopeT,
  $locationT
} from 'angular';

import type {
  StateParamsT
} from 'angular-ui-router';

import type {
  qsStreamT
} from '../qs-stream/qs-stream-module.js';

export function StatusQueryController ($scope:$scopeT, $location:$locationT, qsStream:qsStreamT,
  propagateChange:Function, $stateParams:StateParamsT) {

  'ngInject';

  const qs$ = qsStream($stateParams);
  const p = propagateChange($scope, this, 'qs');

  qs$
  .map(x => x.qs)
  .through(p);

  this.$onDestroy = () => qs$.destroy();

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
      <ui-loader-view class="status-table"></ui-loader-view>
    </div>
  </div>
`
};
