//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

System.config({
  baseURL: '/static/chroma_ui/',
  defaultJSExtensions: true,
  map: {
    iml: 'source/iml',
    angular: 'node_modules/angular/index.js',
    'angular/angular': 'node_modules/angular/angular.js',
    'angular-mocks': 'node_modules/angular-mocks/ngMock.js',
    'angular-mocks/angular-mocks': 'node_modules/angular-mocks/angular-mocks.js',
    text: 'node_modules/systemjs-plugin-text/text.js',
    json: 'node_modules/systemjs-plugin-json/json.js',
    d3: 'node_modules/d3/d3.js',
    nvd3: 'node_modules/nvd3/build/nv.d3.js',
    moment: 'node_modules/moment/moment.js',
    twix: 'bower_components/twix/bin/twix.js',
    highland: 'node_modules/highland/dist/highland.js',
    lodash: 'bower_components/lodash/dist/lodash.js',
    'inferno': 'node_modules/inferno/dist/inferno.js',
    'inferno/dist': 'node_modules/inferno/dist',
    'inferno-component': 'node_modules/inferno-component/inferno-component.js',
    'intel-maybe': 'node_modules/intel-maybe/dist/source/maybe.js',
    'intel-lodash-mixins': 'node_modules/intel-lodash-mixins/index.js',
    'intel-flat-map-changes': 'node_modules/intel-flat-map-changes/dist/source/index.js',
    'intel-debounce':'node_modules/intel-debounce/dist/debounce.js',
    'intel-big-differ': 'node_modules/intel-big-differ/dest/source/big-differ-module.js',
    'intel-qs-parsers': 'node_modules/intel-qs-parsers/dist/source',
    'angular-ui-bootstrap': 'node_modules/angular-ui-bootstrap/index.js',
    'dist/ui-bootstrap-tpls': 'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
    'angular-resource': 'node_modules/angular-resource/index.js',
    'angular-resource/angular-resource': 'node_modules/angular-resource/angular-resource.js',
    'angular-ui-router': 'node_modules/angular-ui-router/release/angular-ui-router.js',
    'angular-animate': 'node_modules/angular-animate/index.js',
    'angular-animate/angular-animate': 'node_modules/angular-animate/angular-animate.js',
    'intel-fp': 'node_modules/intel-fp/dist/source/fp.js',
    'intel-obj': 'node_modules/intel-obj/dist/source/obj.js',
    'intel-math': 'node_modules/intel-math/dist/source/math.js',
    'intel-extract-api': 'node_modules/intel-extract-api/index.js',
    'intel-parsely': 'node_modules/intel-parsely/dist/source/index.js',
    'intel-pdsh-parser': 'node_modules/intel-pdsh-parser/dist/source/index.js',
    sprintf: 'node_modules/sprintf-js/src/sprintf.js',
    'intel-deep-freeze': 'node_modules/intel-deep-freeze/dist/source/index.js'
  },
  meta: {
    'node_modules/intel-big-differ/source/big-differ-module.js': {
      deps: [
        'angular'
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
    'node_modules/angular-ui-router/release/angular-ui-router.js': {
      deps: ['angular']
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
