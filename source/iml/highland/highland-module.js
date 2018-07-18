// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import highland from 'highland';

export default angular
  .module('highland', [])
  .value('λ', highland)
  .value('highland', highland).name;
