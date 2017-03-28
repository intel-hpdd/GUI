// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';

import extendScopeModule from '../extend-scope-module';

import {
  NotificationSliderController,
  notificationSlider
} from './notification-slider';

export default angular
  .module('notificationModule', [extendScopeModule])
  .controller('NotificationSliderController', NotificationSliderController)
  .directive('notificationSlider', notificationSlider).name;
