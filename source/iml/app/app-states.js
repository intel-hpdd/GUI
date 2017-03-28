// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

import appHtml from './assets/html/app.html!text';

export const appState = {
  name: 'app',
  url: '',
  redirectTo: 'app.dashboard.overview',
  controller: 'AppCtrl',
  controllerAs: 'app',
  template: appHtml,
  resolve: {
    alertStream: ['appAlertStream', (x: Function) => x()],
    notificationStream: ['appNotificationStream', (x: Function) => x()],
    session: ['appSession', fp.identity]
  }
};
