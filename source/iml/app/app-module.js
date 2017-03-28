// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import authModule from '../auth/auth-module';
import navigateModule from '../navigate/navigate-module';
import notificationModule from '../notification/notification-module';
import environmentModule from '../environment-module';
import commandModule from '../command/command-module';
import extendScopeModule from '../extend-scope-module';
import helpMapperModule from '../help-mapper/help-mapper-module.js';
import AppCtrl from './app-controller';
import {
  appSessionFactory,
  appNotificationStream,
  alertStream
} from './app-resolves';

export default angular
  .module('app', [
    authModule,
    navigateModule,
    notificationModule,
    environmentModule,
    commandModule,
    extendScopeModule,
    helpMapperModule
  ])
  .factory('appSession', appSessionFactory)
  .value('appNotificationStream', appNotificationStream)
  .value('appAlertStream', alertStream)
  .controller('AppCtrl', AppCtrl).name;
