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
var minifyHtml = require('gulp-minify-html');
var ngHtml2Js = require('gulp-ng-html2js');
var sourcemaps = require('gulp-sourcemaps');
var destDir = require('../dest-dir');
var inject = require('gulp-inject');

var template = 'System.register([\'angular\'], function (_export, _context) {\n\
  var angular;\n\
\n\
  return {\n\
    setters: [function (_angular) {\n\
      angular = _angular.default;\n\
    }],\n\
    execute: function () {\n\
      var name = angular.module(\'<%= template.url %>\', [])\n\
        .run([\'$templateCache\', function ($templateCache) {\n\
          $templateCache.put(\'<%= template.url %>\', \'<%= template.prettyEscapedContent %>\');\n\
      }])\n\
      .name;\n\
\n\
      _export(\'default\', name);\n\
    }\n\
  };\n\
});';

function ng (fn) {
  return gulp.src(paths.templates.angular, {
    since: gulp.lastRun(fn),
    base: '.'
  })
    .pipe(sourcemaps.init())
    .pipe(minifyHtml({
      quotes: true,
      empty: true
    }))
    .pipe(ngHtml2Js({
      prefix: '/static/chroma_ui/',
      stripPrefix: 'source/chroma_ui',
      export: 'system',
      rename: function (url) {
        return url.replace(/\.html$/, '.js');
      },
      template: template
    }))
    .pipe(sourcemaps.write({ sourceRoot: '' }));
}

exports.ngDev = function ngDev () {
  return ng(ngDev)
  .pipe(gulp.dest('./dest'))
  .pipe(gulp.symlink('static/chroma_ui', { cwd: destDir }));
};

exports.ngProd = function ngProd () {
  return ng(exports.ngProd)
  .pipe(gulp.dest('./dest'));
};

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
  .pipe(gulp.dest('dest'));
};


exports.injectProd = function injectProd () {
  var target = gulp.src(paths.templates.index);
  var sources = gulp.src(
    [
      'dest/built.js',
      'dest/source/styles/*.css'
    ],
    {
      read: false,
      base: './dest'
    }
  );

  return target.pipe(inject(sources, {
    transform: function transform (filepath, file) {
      return inject.transform('/static/chroma_ui/' + file.relative);
    }
  }))
  .pipe(gulp.dest('dest'))
  .pipe(gulp.symlink('templates/new', { cwd: destDir }));
};
