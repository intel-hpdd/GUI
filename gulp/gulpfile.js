//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

var path = require('path');
process.chdir(path.dirname(__dirname));

var gulp = require('gulp');
var tasks = require('./tasks');

gulp.task('dev', tasks.dev.dev);
gulp.task('dev:build', tasks.dev.devBuild);
gulp.task('prod', tasks.prod.prod);
gulp.task('prod:local', tasks.prod.prodLocal);
