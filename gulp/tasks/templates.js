//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

'use strict';

var paths = require('../paths.json');
var gulp = require('gulp');
var destDir = require('../dest-dir');
var inject = require('gulp-inject');

function index (fn) {
  return gulp.src(paths.templates.index, {
    since: gulp.lastRun(fn),
    base: '.'
  });
}

exports.indexDev = function indexDev () {
  return index(indexDev)
  .pipe(gulp.dest('templates/new', { cwd: destDir }));
};

exports.indexProd = function indexProd () {
  return index(indexProd)
  .pipe(gulp.dest('./dist'));
};


exports.injectProd = function injectProd () {
  var target = gulp.src(paths.templates.index);
  var sources = gulp.src(
    [
      'dist/built-*.js',
      'dist/source/styles/*.css'
    ],
    {
      read: false,
      base: './dist'
    }
  );

  return target.pipe(inject(sources, {
    transform: function transform (filepath, file) {
      return inject.transform('/static/chroma_ui/' + file.relative);
    }
  }))
  .pipe(gulp.dest('dist'));
};
