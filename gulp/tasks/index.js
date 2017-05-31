//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

'use strict';

module.exports = {
  dev: require('./dev'),
  prod: require('./prod'),
  js: require('./js'),
  watch: require('./watch'),
  clean: require('./clean'),
  templates: require('./templates'),
  assets: require('./assets'),
  test: require('./test')
};
