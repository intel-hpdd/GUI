// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';


import {sorter, sortItem} from './sort-directive';

export default angular.module('sortable', [])
  .directive('sorter', sorter)
  .directive('sortItem', sortItem)
  .name;
