//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';

export default function AboutCtrl (ENV, help) {
  'ngInject';

  angular.extend(this, {
    IS_RELEASE: ENV.IS_RELEASE,
    VERSION: ENV.VERSION,
    BUILD: ENV.BUILD,
    COPYRIGHT_YEAR: help.get('copyright_year')
  });
}
