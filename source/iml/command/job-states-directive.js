//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import jobStatesTemplate from './assets/html/job-states.html!text';

export default function jobStatesDirective () {
  'ngInject';

  return {
    scope: {
      job: '='
    },
    restrict: 'E',
    replace: true,
    template: jobStatesTemplate
  };
}
