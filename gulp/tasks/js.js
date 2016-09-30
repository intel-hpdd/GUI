//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

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
  .pipe(gulp.dest('static/chroma_ui', { cwd: destDir }));
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
  .pipe(gulp.dest('static/chroma_ui', { cwd: destDir }));
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
  .pipe(gulp.dest('static/chroma_ui', { cwd: destDir }));
};

function jsSource (fn) {
  return gulp.src(paths.js.source, {
    since: gulp.lastRun(fn),
    base: '.'
  })
  .pipe(sourcemaps.init());
}

exports.jsSourceDev = function jsSourceDev () {
  return jsSource(jsSourceDev)
  .pipe(babel())
  .pipe(sourcemaps.write({ sourceRoot: '/static/chroma_ui' }))
  .pipe(gulp.dest('./dest'))
  .pipe(gulp.dest('static/chroma_ui', { cwd: destDir }));
};

exports.jsSourceProd = function jsSourceProd () {
  return jsSource(jsSourceProd)
  .pipe(babel())
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
  .pipe(babel())
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
