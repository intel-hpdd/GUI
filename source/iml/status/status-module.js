// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import parselyBoxModule from '../parsely-box/parsely-box-module.js';
import qsFromLocationModule from '../qs-from-location/qs-from-location-module.js';
import commonStatusSearchesModule from '../status/common-status-searches/common-status-searches-module.js';
import extendScopeModule from '../extend-scope-module.js';
import actionDropdownModule from '../action-dropdown/action-dropdown-module.js';
import statusQueryComponent from './status-query-component.js';
import statusRecordsComponent from './status-records-component.js';

import { deferredActionDropdownComponent, DeferredActionDropdownCtrl } from './deferred-action-dropdown';

export default angular
  .module('status', [
    parselyBoxModule,
    qsFromLocationModule,
    commonStatusSearchesModule,
    extendScopeModule,
    actionDropdownModule
  ])
  .controller('DeferredActionDropdownCtrl', DeferredActionDropdownCtrl)
  .component('statusQuery', statusQueryComponent)
  .component('statusRecords', statusRecordsComponent)
  .component('deferredActionDropdown', deferredActionDropdownComponent).name;
