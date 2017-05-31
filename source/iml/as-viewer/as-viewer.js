//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default () => {
  return {
    restrict: 'A',
    transclude: true,
    scope: {
      stream: '=',
      args: '=?',
      transform: '&?',
      name: '<'
    },
    link: function link (scope, el, attrs, ctrl, $transclude) {
      const name =  scope.name || 'viewer';

      $transclude((clone, transcludedScope) => {
        if (transcludedScope.viewer)
          throw new Error(`${name} already set on transcluded scope.`);

        let viewer = scope.stream();

        scope.$on('$destroy', () => viewer.destroy());

        if (scope.transform)
          viewer = scope.transform({
            stream: viewer,
            args: scope.args || []
          });

        transcludedScope[name] = viewer;

        el.append(clone);
      });
    }
  };
};
