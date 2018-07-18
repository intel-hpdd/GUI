// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import progressCircleModule from '../progress-circle/progress-circle-module';
import commandModule from '../command/command-module';
import agentVsCopytoolModule from '../agent-vs-copytool/agent-vs-copytool-module';
import configToggleModule from '../config-toggle/config-toggle-module';
import HsmCtrl from './hsm-controller';
import hsmCdtStatusDirective from './hsm-cdt-status-directive';

import { AddCopytoolModalCtrl, openAddCopytoolModalFactory } from './add-copytool-modal';

export default angular
  .module('hsm', [progressCircleModule, commandModule, agentVsCopytoolModule, configToggleModule])
  .factory('openAddCopytoolModal', openAddCopytoolModalFactory)
  .controller('AddCopytoolModalCtrl', AddCopytoolModalCtrl)
  .controller('HsmCtrl', HsmCtrl)
  .directive('hsmCdtStatus', hsmCdtStatusDirective).name;
