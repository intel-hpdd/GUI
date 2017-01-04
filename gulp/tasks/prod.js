//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

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

var builder = new Builder('./');
var baseURL = builder.loader.baseURL;

function systemBuild () {
  return builder.loadConfig('dist/source/system.config.js')
    .then(function buildBundle () {
      builder.loader.baseURL = baseURL + 'dist/';

      builder.loader.meta = Object
        .keys(builder.loader.meta)
        .reduce(function cleanMeta (obj, key) {
          var testKey = key.replace(/^.+gui\//, builder.loader.baseURL);

          obj[testKey] = builder.loader.meta[key];

          return obj;
        }, {});

      builder.loader.packages = Object
        .keys(builder.loader.packages)
        .reduce(function cleanPackages (obj, key) {
          var testKey = key.replace(/^.+gui\//, builder.loader.baseURL);

          obj[testKey] = builder.loader.packages[key];

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
  .pipe(sourcemaps.write('.', {
    mapSources: function(sourcePath) {
      return sourcePath.replace(/^\.\.\/source\//, '../dist/source/');
    }
  }))
  .pipe(gulp.dest('dist'));
}

var build = gulp.parallel(
  js.jsDepsProd,
  js.jsSourceProd,
  js.socketWorkerProd,
  assets.templatesProd,
  assets.assetsProd,
  css.buildCssProd
);

module.exports.prod = gulp.series(
  clean.cleanDist,
  build,
  systemBuild,
  revJs,
  templates.injectProd,
  clean.cleanBuilt
);
