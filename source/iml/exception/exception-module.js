// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import filtersModule from '../filters/filters-module.js';
import uiBootstrapModule from 'angular-ui-bootstrap';
import exceptionHandlerConfig from './exception-handler.js';
import exceptionModalFactory from './exception-modal.js';
import ExceptionModalCtrl from './exception-modal-controller.js';

export default angular
  .module('exceptionModule', [uiBootstrapModule, filtersModule])
  .config(exceptionHandlerConfig)
  .factory('exceptionModal', exceptionModalFactory)
  .controller('ExceptionModalCtrl', ExceptionModalCtrl).name;
