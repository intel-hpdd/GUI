// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import storageComponent from './storage-component.js';
import storageComponentDetail from './storage-component-detail.js';

export default angular
  .module('storageModule', [])
  .component('storage', storageComponent)
  .component('storageDetail', storageComponentDetail).name;
