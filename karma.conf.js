module.exports = function (config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      // paths loaded by Karma
      {pattern: 'node_modules/systemjs/dist/system.src.js', included: true, watched: true},
      {pattern: 'node_modules/angular/angular.js', included: true, watched: true},
      {pattern: 'node_modules/angular-resource/angular-resource.js', included: true, watched: true},
      {pattern: 'node_modules/angular-animate/angular-animate.js', included: true, watched: true},
      {pattern: 'source/system.config.js', included: true, watched: true},
      {pattern: 'karma-test-shim.js', included: true, watched: true},
      {pattern: 'src/test/matchers.js', included: true, watched: true},

      // paths loaded via module imports
      {pattern: 'node_modules/systemjs-plugin-babel/plugin-babel.js', included: false, watched: true},
      {pattern: 'node_modules/babel-plugin-transform-flow-strip-types/lib/index.js', included: false, watched: true},
      {pattern: 'node_modules/intel-fp/dist/fp.js', included: false, watched: true},
      {pattern: 'node_modules/intel-obj/dist/obj.js', included: false, watched: true},
      {pattern: 'bower_components/highland/dist/highland.js', included: false, watched: true},
      {pattern: 'node_modules/systemjs-plugin-babel/systemjs-babel-browser.js', included: false, watched: true},
      {pattern: 'source/iml/**/*.js', included: false, watched: true},
      {pattern: 'test/spec/**/*.js', included: false, watched: true},


      // paths loaded via Angular's component compiler
      // (these paths need to be rewritten, see proxies section)
      {pattern: 'src/**/*.html', included: false, watched: true},
      {pattern: 'src/**/*.css', included: false, watched: true},

      // paths to support debugging with source maps in dev tools
      {pattern: 'src/**/*.ts', included: false, watched: false},
      {pattern: 'src/**/*.js.map', included: false, watched: false}
    ],

    // proxied base paths
    proxies: {
      // required for component assests fetched by Angular's compiler
      "/static/chroma_ui/": "/base/"
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  })
};

//var util = require('util');
//
//module.exports = function setConfig (config) {
//  'use strict';
//
//  function bound (format) {
//    return util.format.bind(util, format);
//  }
//
//  var sourceDir = bound('source/%s');
//  var bowerDir = bound(sourceDir('bower_components/%s'));
//  var vendorDir = bound(sourceDir('vendor/%s'));
//  var imlDir = bound(sourceDir('iml/%s'));
//  var testDir = bound('test/%s');
//  var nodeModulesDir = bound('node_modules/%s');
//  var angularComponentsDir = bound(nodeModulesDir('intel-angular-modules/%s'));
//
//  config.set({
//    basePath: '',
//    frameworks: ['jasmine', 'systemjs'],
//    files: [],
//    exclude: [
//      imlDir('iml.js')
//    ],
//    reporters: ['dots'],
//    // Only used if junit reporter activated (ex "--reporters junit" on the command line)
//    junitReporter: {
//      outputDir: 'test-results',
//      suite: 'karma-tests (new ui)'
//    },
//    systemjs: {
//      files: [
//        bowerDir('jquery/dist/jquery.js'),
//        nodeModulesDir('angular/angular.js'),
//        nodeModulesDir('angular-resource/angular-resource.js'),
//        nodeModulesDir('angular-route/angular-route.js'),
//        nodeModulesDir('angular-animate/angular-animate.js'),
//        bowerDir('highland/dist/highland.js'),
//        bowerDir('lodash/dist/lodash.js'),
//        bowerDir('moment/moment.js'),
//        bowerDir('twix/bin/twix.js'),
//        bowerDir('d3/d3.js'),
//        bowerDir('nvd3/build/nv.d3.js'),
//        nodeModulesDir('angular-ui-bootstrap/ui-bootstrap-tpls.js'),
//        nodeModulesDir('intel-fp/dist/fp.js'),
//        nodeModulesDir('intel-math/dist/math.js'),
//        nodeModulesDir('intel-obj/dist/obj.js'),
//        nodeModulesDir('intel-lodash-mixins/index.js'),
//        nodeModulesDir('intel-debounce/dist/debounce.js'),
//        vendorDir('**/*.js'),
//        nodeModulesDir('intel-extract-api/index.js'),
//        testDir('iml-module.js'),
//        imlDir('**/*.js'),
//        imlDir('**/*.html'),
//        nodeModulesDir('angular-mocks/angular-mocks.js'),
//        testDir('**/*-module.js'),
//        testDir('data-fixtures/data-fixtures-module.js'),
//        testDir('data-fixtures/**/*.js'),
//        testDir('fixtures/fixtures.js'),
//        testDir('fixtures/**/*.js'),
//        testDir('global-setup.js'),
//        nodeModulesDir('intel-jasmine-n-matchers/jasmine-n-matchers.js'),
//        testDir('**/*.js'),
//        testDir('templates/**/*.html'),
//        angularComponentsDir('src/**/*.js')
//      ],
//      configFile: 'source/system.config.js'
//    },
//    plugins: [
//      'karma-systemjs',
//      'karma-babel-preprocessor',
//      'karma-chrome-launcher',
//      'karma-firefox-launcher',
//      'karma-jasmine',
//      'karma-coverage',
//      'karma-junit-reporter',
//      'karma-ng-html2js-preprocessor',
//      'karma-ng-annotate-preprocessor',
//      'karma-safari-launcher',
//      'krusty-jasmine-reporter'
//    ],
//
//    preprocessors: {
//      '**/*.html': ['ng-html2js'],
//      'source/!(bower_components|styles|vendor)/**/*.js': ['babel', 'ng-annotate'],
//      'test/*.js': ['babel', 'ng-annotate'],
//      'node_modules/intel-fp/fp.js': ['babel'],
//      'node_modules/intel-obj/obj.js': ['babel'],
//      'node_modules/intel-math/math.js': ['babel'],
//      'test/!(templates)/**/*.js': ['babel', 'ng-annotate']
//    },
//
//    babelPreprocessor: {
//      options: {
//        babelrc: false,
//        presets: ['es2015'],
//        plugins: [
//          'transform-es2015-modules-systemjs',
//          'transform-strict-mode',
//          'syntax-flow',
//          'transform-flow-strip-types'
//        ]
//      }
//    },
//
//    ngHtml2JsPreprocessor: {
//      moduleName: 'templates',
//      cacheIdFromPath: function (filepath) {
//        return filepath
//          .replace(/^source\/chroma_ui\//, '')
//          .replace(/^test\/templates\//, '');
//      }
//    },
//    port: 9876,
//    colors: true,
//    logLevel: config.LOG_INFO,
//    autoWatch: false,
//    browsers: ['Chrome', 'Firefox'],
//    captureTimeout: 60000,
//    browserDisconnectTimeout: 10000, // default 2000
//    browserNoActivityTimeout: 10000, //default 10000
//    reportSlowerThan: 100,
//    singleRun: true
//  });
//};

