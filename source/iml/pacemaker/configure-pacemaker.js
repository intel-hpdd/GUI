//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';
import configurePacemakerTemplate
  from './assets/html/configure-pacemaker.html!text';

export default function configurePacemaker() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      stream: '=',
      alertStream: '=',
      jobStream: '='
    },
    controller: fp.noop,
    controllerAs: 'ctrl',
    template: configurePacemakerTemplate
  };
}
