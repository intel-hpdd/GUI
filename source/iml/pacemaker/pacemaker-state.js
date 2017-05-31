//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {lensProp, view, safe} from 'intel-fp';

// $FlowIgnore: HTML templates that flow does not recognize.
import pacemakerStateTemplate from './assets/html/pacemaker-state.html!text';

export default function pacemakerState (propagateChange) {
  'ngInject';

  return {
    restrict: 'E',
    scope: {
      stream: '='
    },
    template: pacemakerStateTemplate,
    link: function link (scope) {
      scope.ctrl = {};
      var state = view(lensProp('state'));
      var p = propagateChange(scope, scope.ctrl, 'state');

      scope.stream
        .map(safe(1, state, null))
        .through(p);

      scope.$on('$destroy', scope.stream.destroy.bind(scope.stream));
    }
  };
}
