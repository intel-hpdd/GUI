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
    .pipe(gulp.dest('./dist'));
}

exports.templatesProd = function templatesProd () {
  return templates(templatesProd)
    .pipe(sourcemaps.init())
    .pipe(minifyHtml({
      quotes: true,
      empty: true
    }))
    .pipe(sourcemaps.write({ sourceRoot: '' }))
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
  .pipe(gulp.dest('./dist'));
};

exports.assetsProd = function assetsProd () {
  return assets(assetsProd)
  .pipe(gulp.dest('./dist'));
};
