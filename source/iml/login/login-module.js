// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import authModule from '../auth/auth-module';
import remoteValidateModule from '../remote-validate/remote-validate-module';
import accessDeniedModule from '../access-denied/access-denied-module';
import tooltipModule from '../tooltip/tooltip-module';
import navigateModule from '../navigate/navigate-module';
import LoginController from './login-controller';

export default angular
  .module('login', [authModule, remoteValidateModule, accessDeniedModule, tooltipModule, navigateModule])
  .controller('LoginCtrl', LoginController).name;
