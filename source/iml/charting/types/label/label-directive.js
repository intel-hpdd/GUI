//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

export function labelDirective(d3, getLabel) {
  'ngInject';
  return {
    restrict: 'A',
    scope: {
      onData: '=',
      onUpdate: '='
    },
    require: '^^charter',
    templateNamespace: 'svg',
    link(scope, el, attrs, chartCtrl) {
      const node = el[0];

      const updateLabel = conf => {
        const label = getLabel().data(scope.onData);

        scope.onUpdate.forEach(x =>
          x({
            label,
            node: d3.select(node),
            ...conf
          }));

        conf.svg.select(fp.always(node)).call(label);
      };

      chartCtrl.onUpdate.push(updateLabel);
    }
  };
}
