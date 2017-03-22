//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

'use strict';

var js = require('./js');
var templates = require('./templates');
var clean = require('./clean');
var css = require('./css');
var watch = require('./watch');
var gulp = require('gulp');
var assets = require('./assets');
var test = require('./test');

var builder = gulp.parallel(
  js.jsDepsDev,
  js.jsSourceDev,
  js.jsTest,
  js.jsTestDeps,
  js.jsTestFixtures,
  assets.templatesDev,
  assets.assetsDev,
  templates.indexDev,
  css.buildCssDev
);

module.exports.devBuild = gulp.series(clean.cleanDist, builder);

module.exports.dev = gulp.series(
  module.exports.devBuild,
  watch,
  test.continuous
);
