// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import angular from 'angular';
import authModule from '../auth/auth-module';
import remoteValidateModule from '../remote-validate/remote-validate-module';
import helpModule from '../help-module';
import atScrollBoundaryModule from '../at-scroll-boundary/at-scroll-boundary-module';
import accessDeniedModule from '../access-denied/access-denied-module';
import tooltipModule from '../tooltip/tooltip-module';
import navigateModule from '../navigate/navigate-module';
import LoginController from './login-controller';
import EulaCtrl from './eula-modal-controller';

// $FlowIgnore: HTML templates that flow does not recognize.
import loginPasswordErrorTemplate from './assets/html/login-password-error';

// $FlowIgnore: HTML templates that flow does not recognize.
import loginUserErrorTemplate from './assets/html/login-user-error';

export default angular.module('login',
  [
    authModule, remoteValidateModule, helpModule, atScrollBoundaryModule,
    accessDeniedModule, tooltipModule, navigateModule, loginPasswordErrorTemplate,
    loginUserErrorTemplate
  ])
  .controller('LoginCtrl', LoginController)
  .controller('EulaCtrl', EulaCtrl)
  .name;