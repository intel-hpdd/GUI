//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

'use strict';

var del = require('del');
var path = require('path');

const cleanOutside = x =>
  del(x, {
    force: true
  });

exports.cleanDist = del.bind(null, './dist');
exports.cleanBuilt = del.bind(null, [
  './dist/built.js',
  './dist/built.js.map',
  './dist/bower_components',
  './dist/node_modules/!(font-awesome)**',
  './dist/source/**/*',
  '!./dist/source/styles',
  '!./dist/source/styles/imports-*.css',
  '!./dist/source/*.ico'
]);
