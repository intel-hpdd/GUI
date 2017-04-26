// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import filtersModule from '../filters/filters-module';
import uiBootstrapModule from 'angular-ui-bootstrap';
import exceptionHandlerConfig from './exception-handler';
import exceptionInterceptorFactory from './exception-interceptor';
import exceptionModalFactory from './exception-modal';
import {
  ExceptionModalCtrl,
  sendStackTraceToRealTime,
  stackTraceContainsLineNumbers
} from './exception-modal-controller';

export default angular
  .module('exceptionModule', [uiBootstrapModule, filtersModule])
  .config(exceptionHandlerConfig)
  .config($httpProvider => {
    'ngInject';
    $httpProvider.interceptors.push('exceptionInterceptor');
  })
  .factory('exceptionInterceptor', exceptionInterceptorFactory)
  .factory('exceptionModal', exceptionModalFactory)
  .controller('ExceptionModalCtrl', ExceptionModalCtrl)
  .value('stackTraceContainsLineNumber', stackTraceContainsLineNumbers)
  .value('sendStackTraceToRealTime', sendStackTraceToRealTime).name;
