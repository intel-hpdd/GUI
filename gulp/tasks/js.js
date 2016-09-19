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

'use strict';

var paths = require('../paths.json');
var gulp = require('gulp');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var destDir = require('../dest-dir');
var relativeSourcemapsSource = require('gulp-relative-sourcemaps-source');

function jsDeps (fn) {
  return gulp.src(paths.js.deps, {
    since: gulp.lastRun(fn),
    base: '.'
  });
}

exports.jsDepsDev = function jsDepsDev () {
  return jsDeps(jsDepsDev)
  .pipe(gulp.dest('./dest'))
  .pipe(gulp.symlink('static/chroma_ui', { cwd: destDir }));
};

exports.jsDepsProd = function jsDepsProd () {
  return jsDeps(jsDepsProd)
  .pipe(gulp.dest('./dest'));
};

function socketWorker (fn) {
  return gulp.src(paths.js.socketWorker, {
    since: gulp.lastRun(fn)
  })
  .pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(sourcemaps.write('.'));
}

exports.socketWorkerDev = function socketWorkerDev () {
  return socketWorker(socketWorkerDev)
  .pipe(gulp.dest('./dest'))
  .pipe(gulp.symlink('static/chroma_ui', { cwd: destDir }));
};

exports.socketWorkerProd = function socketWorkerProd () {
  return socketWorker(socketWorkerProd)
  .pipe(gulp.dest('./dest'))
  .pipe(gulp.dest('./dist'));
};

function systemConfig (fn) {
  return gulp.src(paths.js.config, {
    since: gulp.lastRun(fn),
    base: '.'
  });
}

exports.systemConfigDev = function systemConfigDev () {
  return systemConfig(systemConfigDev)
  .pipe(gulp.dest('./dest'))
  .pipe(gulp.symlink('static/chroma_ui', { cwd: destDir }));
};

var babelDev = babel.bind(null, {
  presets: [],
  babelrc: false,
  plugins: [
    'check-es2015-constants',
    'transform-flow-strip-types',
    'transform-class-properties',
    'transform-object-rest-spread',
    'transform-async-to-generator',
    'transform-es2015-classes',
    'transform-es2015-modules-systemjs'
  ]
});

var babelProd = babel.bind(null, {
  presets: ['es2015'],
  babelrc: false,
  plugins: [
    'transform-flow-strip-types',
    'transform-class-properties',
    'transform-object-rest-spread',
    [
      'angularjs-annotate',
      {
        explicitOnly: true
      }
    ],
    'transform-es2015-modules-systemjs'
  ]
});

function jsSource (fn) {
  return gulp.src(paths.js.source, {
    since: gulp.lastRun(fn),
    base: '.'
  })
  .pipe(sourcemaps.init());
}

exports.jsSourceDev = function jsSourceDev () {
  return jsSource(jsSourceDev)
  .pipe(babelDev())
  .pipe(sourcemaps.write({ sourceRoot: '/static/chroma_ui' }))
  .pipe(gulp.dest('./dest'))
  .pipe(gulp.symlink('static/chroma_ui', { cwd: destDir }));
};

exports.jsSourceProd = function jsSourceProd () {
  return jsSource(jsSourceProd)
  .pipe(babelProd())
  .pipe(relativeSourcemapsSource({dest: 'dest'}))
  .pipe(sourcemaps.write({ sourceRoot: '' }))
  .pipe(gulp.dest('./dest'));
};

exports.jsTest = function jsTest () {
  return gulp.src(paths.js.tests, {
    since: gulp.lastRun(jsTest),
    base: '.'
  })
  .pipe(sourcemaps.init())
  .pipe(babelDev())
  .pipe(sourcemaps.write({ sourceRoot: '' }))
  .pipe(gulp.dest('./dest'));
};

exports.jsTestFixtures = function jsTestFixtures () {
  return gulp.src(paths.js.testFixtures, {
    since: gulp.lastRun(jsTestFixtures),
    base: '.'
  })
  .pipe(gulp.dest('./dest'));
};

exports.jsTestDeps = function jsTestDeps () {
  return gulp.src(paths.js.testDeps, {
    since: gulp.lastRun(jsTestDeps),
    base: '.'
  })
  .pipe(gulp.dest('./dest'));
};
