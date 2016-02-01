var util = require('util');

module.exports = function setConfig (config) {
  'use strict';

  function bound (format) {
    return util.format.bind(util, format);
  }

  var sourceDir = bound('source/chroma_ui/%s');
  var bowerDir = bound('bower_components/%s');
  var vendorDir = bound('vendor/%s');
  var imlDir = bound(sourceDir('iml/%s'));
  var commonDir = bound(sourceDir('common/%s'));
  var testDir = bound('test/%s');
  var nodeModulesDir = bound('node_modules/%s');
  var angularComponentsDir = bound(nodeModulesDir('intel-angular-modules/%s'));

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      bowerDir('jquery/dist/jquery.js'),
      nodeModulesDir('angular/angular.js'),
      nodeModulesDir('angular-resource/angular-resource.js'),
      nodeModulesDir('angular-route/angular-route.js'),
      nodeModulesDir('angular-animate/angular-animate.js'),
      bowerDir('highland/dist/highland.js'),
      bowerDir('lodash/dist/lodash.js'),
      bowerDir('moment/moment.js'),
      bowerDir('twix/bin/twix.js'),
      bowerDir('d3/d3.js'),
      bowerDir('nvd3/build/nv.d3.js'),
      nodeModulesDir('angular-ui-bootstrap/ui-bootstrap-tpls.js'),
      nodeModulesDir('immutable/dist/immutable.js'),
      nodeModulesDir('intel-fp/fp.js'),
      nodeModulesDir('intel-math/math.js'),
      nodeModulesDir('intel-obj/obj.js'),
      nodeModulesDir('intel-lodash-mixins/index.js'),
      nodeModulesDir('intel-debounce/dist/debounce.js'),
      vendorDir('**/*.js'),
      commonDir('**/*-module.js'),
      commonDir('**/*.js'),
      commonDir('**/*.html'),
      imlDir('**/*-exports.js'),
      imlDir('**/*-module.js'),
      nodeModulesDir('intel-extract-api/index.js'),
      testDir('iml-module.js'),
      imlDir('**/*.js'),
      imlDir('**/*.html'),
      nodeModulesDir('angular-mocks/angular-mocks.js'),
      testDir('**/*-module.js'),
      testDir('data-fixtures/data-fixtures-module.js'),
      testDir('data-fixtures/**/*.js'),
      testDir('fixtures/fixtures.js'),
      testDir('fixtures/**/*.js'),
      testDir('global-setup.js'),
      nodeModulesDir('intel-jasmine-n-matchers/jasmine-n-matchers.js'),
      testDir('**/*.js'),
      testDir('templates/**/*.html'),
      angularComponentsDir('src/**/*.js')
    ],
    exclude: [
      imlDir('iml.js')
    ],
    reporters: ['dots'],
    // Only used if junit reporter activated (ex "--reporters junit" on the command line)
    junitReporter: {
      outputDir: 'test-results',
      suite: 'karma-tests (new ui)'
    },

    plugins: [
      'karma-babel-preprocessor',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-coverage',
      'karma-junit-reporter',
      'karma-ng-html2js-preprocessor',
      'karma-ng-annotate-preprocessor',
      'karma-safari-launcher',
      'krusty-jasmine-reporter'
    ],

    preprocessors: {
      '**/*.html': ['ng-html2js'],
      'source/chroma_ui/!(bower_components|styles|vendor)/**/*.js': ['babel', 'ng-annotate'],
      'test/*.js': ['babel', 'ng-annotate'],
      'node_modules/intel-fp/fp.js': ['babel'],
      'node_modules/intel-obj/obj.js': ['babel'],
      'node_modules/intel-math/math.js': ['babel'],
      'test/!(templates)/**/*.js': ['babel', 'ng-annotate']
    },

    babelPreprocessor: {
      options: {
        babelrc: false,
        presets: ['es2015'],
        plugins: [
          'transform-es2015-modules-umd',
          'transform-strict-mode',
          'syntax-flow',
          'transform-flow-strip-types'
        ]
      }
    },

    ngHtml2JsPreprocessor: {
      moduleName: 'templates',
      cacheIdFromPath: function (filepath) {
        return filepath
          .replace(/^source\/chroma_ui\//, '')
          .replace(/^test\/templates\//, '');
      }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome', 'Firefox'],
    captureTimeout: 60000,
    browserDisconnectTimeout: 10000, // default 2000
    browserNoActivityTimeout: 10000, //default 10000
    reportSlowerThan: 100,
    singleRun: true
  });
};
