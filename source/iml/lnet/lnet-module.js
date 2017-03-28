// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import extendScopeModule from '../extend-scope-module';
import bigDifferModule from 'intel-big-differ';
import commandModule from '../command/command-module';
import filterModule from '../filters/filters-module';
import {
  ConfigureLnetController,
  configureLnetComponent
} from './configure-lnet';
import lnetStatus from './lnet-status';
import options from './lnet-options';
import removeUsedLnetOptionsFilter from './remove-used-lnet-options-filter';

export const ADD_LNET_CONFIGURATION_ITEMS = 'ADD_LNET_CONFIGURATION_ITEMS';

export default angular
  .module('lnetModule', [
    extendScopeModule,
    bigDifferModule,
    filterModule,
    commandModule
  ])
  .value('LNET_OPTIONS', options)
  .controller('ConfigureLnetController', ConfigureLnetController)
  .component('configureLnet', configureLnetComponent)
  .component('lnetStatus', lnetStatus)
  .filter('removeUsedLnetOptions', removeUsedLnetOptionsFilter).name;
