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

export const loginState = {
  name: 'login',
  url: '/login',
  controller: 'LoginCtrl',
  controllerAs: 'login',
  template: `<div class="container">
  <div class="login-partial">
    <header class="logo"></header>
    <div class="login">
      <form novalidate name="loginForm" remote-validate-form validate="login.validate">
        <div class="ng-cloak alert alert-danger auth-failed span4 offset4" ng-repeat="error in serverValidationError.__all__">
          {{ error }}
        </div>
        <div class="form-group username-group" ng-class="{'has-error': loginForm.username.$invalid}">
          <input
            autofocus
            class="form-control"
            type="text"
            name="username"
            autocomplete="off"
            ng-model="login.username"
            remote-validate-component
            placeholder="Username"
            />
          <iml-tooltip class="error-tooltip" direction="top">
            <ul>
              <li ng-repeat="error in serverValidationError.username">{{ error }}</li>
            </ul>
          </iml-tooltip>
        </div>
        <div class="form-group password-group" ng-class="{'has-error': loginForm.password.$invalid}">
          <input
            class="form-control"
            type="password"
            name="password"
            autocomplete="off"
            ng-model="login.password"
            remote-validate-component
            placeholder="Password"
          />
        <iml-tooltip class="error-tooltip" direction="bottom">
          <ul>
            <li ng-repeat="error in serverValidationError.password">{{ error }}</li>
          </ul>
        </iml-tooltip>
        </div>
        <button type="submit" class="btn btn-success" ng-disabled="loginForm.$pristine || login.inProgress" ng-click="login.submitLogin()">
          <i class="fa fa-unlock"></i> Login
        </button>
        <div class="skip-login-row" ng-if="login.ALLOW_ANONYMOUS_READ">
          <div class="skip-login">
            <small>
              <a ng-click="login.goToIndex()">Or Continue As Anonymous</a>
            <span class="tooltip-container tooltip-hover">
              <a><i class="fa fa-question-circle"></i></a>
              <help-tooltip topic="continue_as_anonymous" direction="right" size="'large'"></help-tooltip>
            </span>
            </small>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>`
};
