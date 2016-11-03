//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

'use strict';

var del = require('del');
var path = require('path');
var destDir = require('../dest-dir');

const cleanOutside = x => del(x, {
  force: true
});

exports.cleanStatic = cleanOutside.bind(null, path.join(destDir, '/static/chroma_ui'));
exports.cleanTemplates = cleanOutside.bind(null, path.join(destDir, 'templates/new'));
exports.cleanDest = del.bind(null, './dest');
exports.cleanDist = del.bind(null, './dist');
exports.cleanBuilt = del.bind(null, ['./dist/built.js', './dist/built.js.map']);
