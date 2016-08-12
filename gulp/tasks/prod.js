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

var js = require('./js');
var templates = require('./templates');
var clean = require('./clean');
var css = require('./css');
var gulp = require('gulp');
var assets = require('./assets');
var Builder = require('systemjs-builder');
var rev = require('gulp-rev');
var sourcemaps = require('gulp-sourcemaps');
var destDir = require('../dest-dir');

var builder = new Builder('./');
var baseURL = builder.loader.baseURL;

function systemBuild () {
  return builder.loadConfig('dest/source/system.config.js')
    .then(function buildBundle () {
      builder.loader.baseURL = baseURL + 'dest/';

      builder.loader.meta = Object.keys(builder.loader.meta)
      .reduce(function cleanMeta (obj, key) {
        var testKey = key.replace(/^.+static\/chroma_ui\//, builder.loader.baseURL);

        obj[testKey] = builder.loader.meta[key];

        return obj;
      }, {});

      return builder.buildStatic('source/iml/iml-module.js', 'dist/built.js', {
        runtime: false,
        sourceMaps: true,
        minify: true
      });
    });
}

function revJs () {
  return gulp.src('dist/built.js')
  .pipe(sourcemaps.init({
    loadMaps: true
  }))
  .pipe(rev())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist'));
}

var cleaner = gulp.parallel(
  clean.cleanDest,
  clean.cleanDist
);

var build = gulp.parallel(
  js.jsDepsProd,
  js.jsSourceProd,
  js.socketWorkerProd,
  js.jsTest,
  js.jsTestDeps,
  assets.templatesProd,
  assets.assetsProd,
  css.buildCssProd
);

module.exports.prod = gulp.series(
  cleaner,
  build,
  systemBuild,
  revJs,
  templates.injectProd,
  clean.cleanBuilt
);

module.exports.prodLocal = gulp.series(
  gulp.parallel(
    clean.cleanTemplates,
    clean.cleanStatic
  ),
  module.exports.prod,
  function moveJs () {
    return gulp
      .src('dist/**/*', {
        base: './dist'
      })
      .pipe(gulp.dest('static/chroma_ui', { cwd: destDir }));
  },
  function moveTemplate () {
    return gulp
      .src('dist/index.html', {
        base: './dist'
      })
      .pipe(gulp.dest('templates/new', { cwd: destDir }));
  }
)
