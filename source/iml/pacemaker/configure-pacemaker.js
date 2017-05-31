//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {
  noop
} from 'intel-fp';

// $FlowIgnore: HTML templates that flow does not recognize.
import configurePacemakerTemplate from './assets/html/configure-pacemaker.html!text';

export default function configurePacemaker () {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      stream: '=',
      alertStream: '=',
      jobStream: '='
    },
    controller: noop,
    controllerAs: 'ctrl',
    template: configurePacemakerTemplate
  };
}
