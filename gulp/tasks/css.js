//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

'use strict';

var gulp = require('gulp');
var paths = require('../paths.json');
var less = require('gulp-less');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var cleancss = new LessPluginCleanCSS({ advanced: true });
var sourcemaps = require('gulp-sourcemaps');
var rev = require('gulp-rev');

function buildCss (fn) {
  return gulp.src(paths.less.imports, {
    since: gulp.lastRun(fn),
    base: '.'
  })
    .pipe(sourcemaps.init())
    .pipe(less({
      relativeUrls: false,
      rootpath: '',
      paths: ['./source/', './'],
      plugins: [cleancss]
    }));
}

module.exports.buildCssDev = function buildCssDev () {
  return buildCss(buildCssDev, '')
  .pipe(sourcemaps.write({ sourceRoot: '' }))
  .pipe(gulp.dest('./dist'));
};


module.exports.buildCssProd = function buildCssProd () {
  return buildCss(buildCssProd)
  .pipe(rev())
  .pipe(sourcemaps.write({ sourceRoot: '.' }))
  .pipe(gulp.dest('./dist'));
};
