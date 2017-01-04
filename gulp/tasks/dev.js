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
var watch = require('./watch');
var gulp = require('gulp');
var assets = require('./assets');
var test = require('./test');

var builder = gulp.parallel(
  js.jsDepsDev,
  js.jsSourceDev,
  js.socketWorkerDev,
  js.jsTest,
  js.jsTestDeps,
  js.jsTestFixtures,
  assets.templatesDev,
  assets.assetsDev,
  templates.indexDev,
  css.buildCssDev
);

module.exports.devBuild = gulp.series(
  clean.cleanDist,
  builder
);

module.exports.dev = gulp.series(
  module.exports.devBuild,
  watch,
  test.continuous
);
