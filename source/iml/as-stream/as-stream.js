//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from "highland";

export default function asStream() {
  "ngInject";
  return {
    restrict: "A",
    transclude: true,
    scope: {
      val: "="
    },
    link: function link(scope, el, attrs, ctrl, $transclude) {
      $transclude(function createStream(clone, transcludedScope) {
        if (transcludedScope.str) throw new Error("str already set on transcluded scope.");

        const stream = highland();

        scope.$watch("val", stream.write.bind(stream));
        scope.$on("$destroy", stream.destroy.bind(stream));

        transcludedScope.str = stream;

        el.append(clone);
      });
    }
  };
}
