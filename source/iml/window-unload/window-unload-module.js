// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';

import {windowUnloadFactory} from './window-unload';

export type windowUnloadT = {
  unloading:boolean
};

export default angular.module('windowUnload', [])
  .factory('windowUnload', windowUnloadFactory)
  .name;
