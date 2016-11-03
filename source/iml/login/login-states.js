// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import loginTemplate from './assets/html/login.html!text';

export const loginState = {
  name: 'login',
  url: '/login',
  controller: 'LoginCtrl',
  controllerAs: 'login',
  template: loginTemplate
};
