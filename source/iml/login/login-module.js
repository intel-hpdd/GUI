// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import authModule from '../auth/auth-module';
import remoteValidateModule from '../remote-validate/remote-validate-module';
import helpModule from '../help-module';
import atScrollBoundaryModule
  from '../at-scroll-boundary/at-scroll-boundary-module';
import accessDeniedModule from '../access-denied/access-denied-module';
import tooltipModule from '../tooltip/tooltip-module';
import navigateModule from '../navigate/navigate-module';
import LoginController from './login-controller';
import EulaCtrl from './eula-modal-controller';

export default angular
  .module('login', [
    authModule,
    remoteValidateModule,
    helpModule,
    atScrollBoundaryModule,
    accessDeniedModule,
    tooltipModule,
    navigateModule
  ])
  .controller('LoginCtrl', LoginController)
  .controller('EulaCtrl', EulaCtrl).name;
