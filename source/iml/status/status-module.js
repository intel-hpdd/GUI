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

import angular from 'angular';
import parselyBoxModule from '../parsely-box/parsely-box-module.js';
import multiStreamModule from '../multi-stream/multi-stream-module.js';
import routeStreamModule from '../route-stream/route-stream-module.js';
import qsFromLocationModule from '../qs-from-location/qs-from-location-module.js';
import commonStatusSearchesModule from '../status/common-status-searches/common-status-searches-module.js';
import extendScopeModule from '../extend-scope-module.js';
import actionDropdownModule from '../action-dropdown/action-dropdown-module.js';
import statusQsToInputParser from './status-qs-to-input-parser.js';
import statusInputToQsParser from './status-input-to-qs-parser.js';
import statusCompleter from './status-completer.js';

import StatusController from './status-controller';
import StatusQueryController from './status-query-controller';
import {
  deferredActionDropdownComponent, DeferredActionDropdownCtrl
} from './deferred-action-dropdown';

export default angular.module('status', [
  parselyBoxModule, multiStreamModule,
  routeStreamModule, qsFromLocationModule, commonStatusSearchesModule,
  extendScopeModule, actionDropdownModule
])
  .controller('StatusController', StatusController)
  .controller('StatusQueryController', StatusQueryController)
  .controller('DeferredActionDropdownCtrl', DeferredActionDropdownCtrl)
  .component('deferredActionDropdown', deferredActionDropdownComponent)
  .value('statusInputToQsParser', statusInputToQsParser)
  .value('statusQsToInputParser', statusQsToInputParser)
  .value('statusCompleter', statusCompleter)
  .name;
