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

var gulp = require('gulp');
var paths = require('../paths.json');
var less = require('gulp-less');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var cleancss = new LessPluginCleanCSS({ advanced: true });
var sourcemaps = require('gulp-sourcemaps');
var destDir = require('../dest-dir');
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
  return buildCss (buildCssDev, '')
  .pipe(sourcemaps.write({ sourceRoot: '' }))
  .pipe(gulp.dest('./dest'))
  .pipe(gulp.symlink('static/chroma_ui', { cwd: destDir }));
};


module.exports.buildCssProd = function buildCssProd () {
  return buildCss (buildCssProd)
  .pipe(rev())
  .pipe(sourcemaps.write({ sourceRoot: '.' }))
  .pipe(gulp.dest('./dest'))
  .pipe(gulp.symlink('static/chroma_ui/', { cwd: destDir }));
};
