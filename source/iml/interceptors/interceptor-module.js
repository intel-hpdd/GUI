// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import environmentModule from '../environment-module';
import {addStaticDirInterceptorFactory} from './add-static-dir';
import {cleanRequestUrlInterceptorFactory} from './clean-request-url';
import {tastypieInterceptorFactory} from './tastypie';

export default angular.module('interceptors', [environmentModule])
  .factory('addStaticDirInterceptor', addStaticDirInterceptorFactory)
  .factory('cleanRequestUrlInterceptor', cleanRequestUrlInterceptorFactory)
  .factory('tastypieInterceptor', tastypieInterceptorFactory)
  .config(($httpProvider) => {
    'ngInject';

    $httpProvider.interceptors.push(
      'addStaticDirInterceptor',
      'cleanRequestUrlInterceptor',
      'tastypieInterceptor'
    );
  })
  .name;
