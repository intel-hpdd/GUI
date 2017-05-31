//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {curry} from 'intel-fp';

export default function asValue (localApply, $exceptionHandler) {
  'ngInject';

  return {
    restrict: 'A',
    transclude: true,
    scope: {
      stream: '='
    },
    link: function link (scope, el, attrs, ctrl, $transclude) {
      $transclude(function createValue (clone, transcludedScope) {
        if (transcludedScope.curr)
          throw new Error('curr already set on transcluded scope.');

        transcludedScope.curr = {};

        scope
          .stream
          .fork()
          .tap(v => transcludedScope.curr.val = v)
          .stopOnError(curry(1, $exceptionHandler))
          .each(localApply.bind(null, transcludedScope));


        el.append(clone);
      });
    }
  };
}
