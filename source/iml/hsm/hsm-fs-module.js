// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import commandModule from '../command/command-module';
import helpModule from '../help-module';
import highlandModule from '../highland/highland-module';
import HsmFsCtrl from './hsm-fs-controller';

export default angular
  .module('hsmFs', [commandModule, helpModule, highlandModule])
  .controller('HsmFsCtrl', HsmFsCtrl).name;
