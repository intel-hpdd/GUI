//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

'use strict';

var paths = require('../paths.json');
var gulp = require('gulp');
var destDir = require('../dest-dir');
var sourcemaps = require('gulp-sourcemaps');
var minifyHtml = require('gulp-minify-html');

function templates (fn) {
  return gulp.src([
    paths.assets.templates
  ], {
    since: gulp.lastRun(fn),
    base: '.'
  });
}

exports.templatesDev = function templatesDev () {
  return templates(templatesDev)
    .pipe(gulp.dest('./dest'))
    .pipe(gulp.dest('static/chroma_ui', { cwd: destDir }));
}

exports.templatesProd = function templatesProd () {
  return templates(templatesProd)
    .pipe(sourcemaps.init())
    .pipe(minifyHtml({
      quotes: true,
      empty: true
    }))
    .pipe(sourcemaps.write({ sourceRoot: '' }))
    .pipe(gulp.dest('./dest'))
    .pipe(gulp.dest('./dist'));
}

function assets (fn) {
  return gulp.src([paths.assets.fonts, paths.assets.images], {
    since: gulp.lastRun(fn),
    base: '.'
  });
}

exports.assetsDev = function assetsDev () {
  return assets(assetsDev)
  .pipe(gulp.dest('./dest'))
  .pipe(gulp.dest('static/chroma_ui', { cwd: destDir }));
};

exports.assetsProd = function assetsProd () {
  return assets(assetsProd)
  .pipe(gulp.dest('./dest'))
  .pipe(gulp.dest('./dist'));
};
