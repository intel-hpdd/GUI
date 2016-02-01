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
  transpiler: 'plugin-babel',
  babelOptions: {
    plugins: [
      'transform-flow-strip-types'
    ]
  },
  baseURL: '/static/chroma_ui/',
  packages: {
    'iml': {
      defaultExtension: 'js'
    },
    'intel-angular-modules': {
      defaultExtension: 'js'
    }
  },
  map: {
    'transform-flow-strip-types': 'node_modules/babel-plugin-transform-flow-strip-types/lib/index.js',
    'plugin-babel': 'node_modules/systemjs-plugin-babel/plugin-babel.js',
    'systemjs-babel-build': 'node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',
    text: 'path/to/text.js',
    angular: 'node_modules/angular/angular.js',
    d3: 'bower_components/d3/d3.js',
    nv: 'bower_components/nvd3/build/nv.d3.js',
    moment: 'bower_components/moment/moment.js',
    highland: 'bower_components/highland/dist/highland.js',
    lodash: 'bower_components/lodash/dist/lodash.js',
    'intel-lodash-mixins': 'node_modules/intel-lodash-mixins/index.js',
    'intel-angular-modules': 'node_modules/intel-angular-modules/src',
    'intel-debounce':'node_modules/intel-debounce/dist/debounce.js',
    'ui-bootstrap': 'node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.js',
    'ng-resource': 'node_modules/angular-resource/angular-resource.js',
    'ng-route': 'node_modules/angular-route/angular-route.js',
    'ng-animate': 'node_modules/angular-animate/angular-animate.js',
    'ng-route-segment': 'node_modules/intel-angular-route-segment/build/angular-route-segment.js',
    'intel-fp': 'node_modules/intel-fp/dist/fp.js',
    'intel-obj': 'node_modules/intel-obj/dist/obj.js',
    'intel-math': 'node_modules/intel-math/dist/math.js',
    'intel-extract-api': 'node_modules/intel-extract-api/index.js'
  },
  meta: {
    // meaning [baseURL]/vendor/angular.js when no other rules are present
    // path is normalized using map and paths configuration
    'node_modules/angular/angular.js': {
      format: 'global', // load this module as a global
      exports: 'angular' // the global property to take as the module value
    },
    'node_modules/intel-extract-api/index.js': {
      format: 'global',
      deps: ['angular']
    },
    'node_modules/intel-lodash-mixins/index.js': {
      deps: ['lodash']
    },
    'intel-angular-modules/pdsh-parser/pdsh-parser-module.js': {
      deps: ['intel-angular-modules/comparators/comparators-module.js']
    },
    'node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.js': {
      format: 'global'
    },
    'node_modules/angular-resource/angular-resource.js': {
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
        'ng-route'
      ]
    },
    'node_modules/intel-angular-modules/src': {
      deps: [
        'angular'
      ]
    }
  }
});
