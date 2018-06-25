// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import extendScopeModule from '../extend-scope-module';
import commandModule from '../command/command-module';
import corosyncStateComponent from './corosync-state';
import filterModule from '../filters/filters-module';
import { ConfigureCorosyncController, configureCorosyncComponent } from './configure-corosync';
import bigDifferModule from '../big-differ/big-differ-module.js';

export default angular
  .module('corosyncModule', [extendScopeModule, commandModule, bigDifferModule, filterModule])
  .component('corosyncState', corosyncStateComponent)
  .controller('ConfigureCorosyncController', ConfigureCorosyncController)
  .component('configureCorosync', configureCorosyncComponent).name;
