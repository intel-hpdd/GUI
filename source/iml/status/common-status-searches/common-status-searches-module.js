// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import uiBootstrapModule from 'angular-ui-bootstrap';
import commonStatusSearches from './common-status-searches-component';

export default angular
  .module('commonStatusSearches', [uiBootstrapModule])
  .component('commonStatusSearches', commonStatusSearches).name;
