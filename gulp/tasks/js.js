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
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var destDir = require('../dest-dir');

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

babel = babel.bind(null, {
  presets: ['es2015'],
  babelrc: false,
  plugins: [
    'transform-flow-strip-types',
    'transform-strict-mode',
    'transform-es2015-modules-systemjs',
    'transform-class-properties',
    'transform-object-rest-spread'
  ]
});

function jsSource (fn) {
  return gulp.src(paths.js.source, {
    since: gulp.lastRun(fn),
    base: '.'
  })
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(ngAnnotate({
    single_quotes: true
  }))
  .pipe(sourcemaps.write({ sourceRoot: '' }));
}

exports.jsSourceDev = function jsSourceDev () {
  return jsSource(jsSourceDev)
  .pipe(gulp.dest('./dest'))
  .pipe(gulp.symlink('static/chroma_ui', { cwd: destDir }));
};

exports.jsSourceProd = function jsSourceProd () {
  return jsSource(jsSourceProd)
  .pipe(gulp.dest('./dest'));
};

exports.jsTest = function jsTest () {
  return gulp.src(paths.js.tests, {
    since: gulp.lastRun(jsTest),
    base: '.'
  })
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(ngAnnotate({
    single_quotes: true
  }))
  .pipe(sourcemaps.write({ sourceRoot: '' }))
  .pipe(gulp.dest('./dest'));
};

exports.jsTestDeps = function jsTestDeps () {
  return gulp.src(paths.js.testDeps, {
    since: gulp.lastRun(jsTestDeps),
    base: '.'
  })
  .pipe(gulp.dest('./dest'));
};
