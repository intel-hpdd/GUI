// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import qsFromLocationFactory from './qs-from-location';

export type qsFromLocationT = (params:Object) => string;

export default angular.module('qsFromLocation', [])
  .factory('qsFromLocation', qsFromLocationFactory)
  .name;
