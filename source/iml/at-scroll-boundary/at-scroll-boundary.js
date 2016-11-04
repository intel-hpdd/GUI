//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import _ from 'intel-lodash-mixins';

export default function atScrollBoundary () {
  'ngInject';

  const BOTTOM = 'bottom';

  return {
    restrict: 'A',
    link: function postLink (scope, el, attrs) {
      _.defaults(scope, {scrollDirection: BOTTOM, hitBoundary: false});

      const oneHit = scope.$eval(attrs.oneHit);
      let unwrappedEl = el[0];

      //@TODO: Add other directions as needed.
      const directions = {};
      directions[BOTTOM] = function isAtBottom () {
        return unwrappedEl.scrollTop + unwrappedEl.clientHeight >= unwrappedEl.scrollHeight - 20;
      };

      const scrollFunc = scope.$apply.bind(scope, function onScroll () {
        scope.hitBoundary = (directions[scope.scrollDirection] || angular.identity.bind(null, false))();

        if (oneHit && scope.hitBoundary)
          cleanup();
      });

      function cleanup () {
        if (unwrappedEl)
          unwrappedEl.removeEventListener('scroll', scrollFunc, true);

        unwrappedEl = null;
      }

      unwrappedEl.addEventListener('scroll', scrollFunc, true);

      scope.$on('$destroy', cleanup);
    }
  };
}
