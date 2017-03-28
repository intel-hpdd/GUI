// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import commandModule from '../command/command-module';
import {
  ActionDropdownCtrl,
  actionDropdown,
  actionDescriptionCache
} from './action-dropdown';
import {
  ConfirmActionModalCtrl,
  openConfirmActionModalFactory
} from './confirm-action-modal';
import groupActionsFilter from './group-actions';
import handleActionFactory from './handle-action';
import uiBootstrapModule from 'angular-ui-bootstrap';

export default angular
  .module('action-dropdown-module', [commandModule, uiBootstrapModule])
  .factory('actionDescriptionCache', actionDescriptionCache)
  .controller('ActionDropdownCtrl', ActionDropdownCtrl)
  .directive('actionDropdown', actionDropdown)
  .controller('ConfirmActionModalCtrl', ConfirmActionModalCtrl)
  .factory('openConfirmActionModal', openConfirmActionModalFactory)
  .filter('groupActions', groupActionsFilter)
  .factory('handleAction', handleActionFactory).name;
