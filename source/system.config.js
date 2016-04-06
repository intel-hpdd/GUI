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

System.config({
  baseURL: '/static/chroma_ui/',
  defaultJSExtensions: true,
  map: {
    iml: 'source/iml',
    angular: 'node_modules/angular/index.js',
    'angular/angular': 'node_modules/angular/angular.js',
    'angular-mocks': 'node_modules/angular-mocks/ngMock.js',
    'angular-mocks/angular-mocks': 'node_modules/angular-mocks/angular-mocks.js',
    'jquery': 'node_modules/jquery/dist/jquery.js',
    d3: 'node_modules/d3/d3.js',
    nvd3: 'node_modules/nvd3/build/nv.d3.js',
    moment: 'node_modules/moment/moment.js',
    twix: 'bower_components/twix/bin/twix.js',
    highland: 'node_modules/highland/dist/highland.js',
    lodash: 'bower_components/lodash/dist/lodash.js',
    'intel-maybe': 'node_modules/intel-maybe/dist/maybe.js',
    'intel-lodash-mixins': 'node_modules/intel-lodash-mixins/index.js',
    'intel-debounce':'node_modules/intel-debounce/dist/debounce.js',
    'intel-big-differ': 'node_modules/intel-big-differ/dest/source/big-differ-module.js',
    'intel-qs-parsers': 'node_modules/intel-qs-parsers/dist/source',
    'angular-ui-bootstrap': 'node_modules/angular-ui-bootstrap/index.js',
    'dist/ui-bootstrap-tpls': 'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
    'angular-resource': 'node_modules/angular-resource/index.js',
    'angular-resource/angular-resource': 'node_modules/angular-resource/angular-resource.js',
    'angular-route': 'node_modules/angular-route/index.js',
    'angular-route/angular-route': 'node_modules/angular-route/angular-route.js',
    'angular-animate': 'node_modules/angular-animate/index.js',
    'angular-animate/angular-animate': 'node_modules/angular-animate/angular-animate.js',
    'intel-angular-route-segment': 'node_modules/intel-angular-route-segment/build/angular-route-segment.js',
    'intel-fp': 'node_modules/intel-fp/dist/source/fp.js',
    'intel-obj': 'node_modules/intel-obj/dist/source/obj.js',
    'intel-math': 'node_modules/intel-math/dist/math.js',
    'intel-extract-api': 'node_modules/intel-extract-api/index.js',
    'intel-parsely': 'node_modules/intel-parsely/dist/source/index.js',
    'intel-pdsh-parser': 'node_modules/intel-pdsh-parser/dist/source/index.js',
    'sprintf': 'node_modules/sprintf-js/src/sprintf.js',
    'intel-deep-freeze': 'node_modules/intel-deep-freeze/dist/source/index.js'
  },
  meta: {
    'node_modules/intel-big-differ/source/big-differ-module.js': {
      deps: [
        'angular'
      ]
    },
    'node_modules/angular/index.js': {
      deps: [
        'jquery'
      ]
    },
    'node_modules/angular-ui-bootstrap/index.js': {
      deps: ['angular']
    },
    'node_modules/angular-mocks/ngMock.js': {
      deps: ['angular']
    },
    'node_modules/intel-lodash-mixins/index.js': {
      deps: ['lodash']
    },
    'node_modules/angular-resource/index.js': {
      deps: ['angular']
    },
    'node_modules/angular-animate/angular-animate.js': {
      deps: ['angular']
    },
    'node_modules/angular-route/angular-route.js': {
      deps: ['angular']
    },
    'node_modules/intel-angular-route-segment/build/angular-route-segment.js': {
      deps: [
        'angular',
        'angular-route'
      ]
    },
    'bower_components/twix/bin/twix.js': {
      deps: [
        'moment'
      ]
    },
    'node_modules/nvd3/build/nv.d3.js': {
      deps: [
        'd3'
      ]
    }
  }
});
