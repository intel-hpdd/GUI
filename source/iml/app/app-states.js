// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

// $FlowIgnore: HTML templates that flow does not recognize.
import appHtml from './assets/html/app.html!text';

export const appState = {
  name: 'app',
  url: '',
  redirectTo: 'app.dashboard.overview',
  controller: 'AppCtrl',
  controllerAs: 'app',
  template: appHtml,
  resolve: {
    alertStream: ['appAlertStream', fp.invoke(fp.__, [])],
    notificationStream: ['appNotificationStream', fp.invoke(fp.__, [])],
    session: ['appSession', fp.identity]
  }
};
