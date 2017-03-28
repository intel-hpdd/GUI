//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default () => {
  return {
    restrict: 'A',
    transclude: true,
    link(scope, el, attrs, ctrl, $transclude) {
      $transclude(function transcludeContent(clone, transcludedScope) {
        if (transcludedScope.configToggle)
          throw new Error('configToggle already set on transcluded scope.');

        let state;

        scope.configToggle = {
          inactive() {
            return !state;
          },
          active() {
            return state;
          },
          setActive() {
            state = true;
          },
          setInactive() {
            state = false;
          }
        };

        el.append(clone);
      });
    }
  };
};
