//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";

import { formatNumber, formatBytes } from "@iml/number-formatters";
import broadcaster from "../../broadcaster.js";

export function UsageInfoController($scope, propagateChange) {
  "ngInject";
  this.format = this.prefix === "bytes" ? formatBytes : formatNumber;

  const normalize = prefix => x => {
    [`${prefix}_free`, `${prefix}_total`].forEach(key => {
      const single = key.split("_").join("");

      if (single in x) x[key] = x[single];
    });

    return x;
  };

  const addMetrics = prefix => x => {
    x[`${prefix}_used`] = x[`${prefix}_total`] - x[`${prefix}_free`];

    return x;
  };

  const prefix = this.prefix;
  this.generateStats = fp.map(function(x) {
    return [
      [
        {
          key: "Free",
          y: x[prefix + "_free"]
        },
        {
          key: "Used",
          y: x[prefix + "_used"]
        }
      ]
    ];
  });

  const buildMetrics = fp.flow(
    fp.map(normalize(this.prefix)),
    fp.map(addMetrics(this.prefix))
  );

  let s = this.stream.flatten();

  if (this.id != null) {
    const eqId = fp.eqFn(fp.identity)(fp.view(fp.lensProp("id")))(this.id);

    s = fp.filter(eqId)(s);
  }

  this.s2 = broadcaster(buildMetrics(s));

  this.s2().through(propagateChange.bind(null, $scope, this, "data"));
}

export function usageInfoDirective() {
  "ngInject";
  return {
    restrict: "E",
    scope: {
      stream: "=",
      prefix: "@",
      id: "=?"
    },
    controller: "UsageInfoController",
    controllerAs: "ctrl",
    bindToController: true,
    template: `<div class="usage-info">
  <div ng-if="ctrl.data[ctrl.prefix + '_total'] != null" as-viewer stream="ctrl.s2" transform="ctrl.generateStats(stream)">
    <pie-graph stream="viewer"></pie-graph>
    <span>{{ ctrl.format(ctrl.data[ctrl.prefix + '_used']) }}  / {{ ctrl.format(ctrl.data[ctrl.prefix + '_total']) }}</span>
  </div>
  <div ng-if="ctrl.data[ctrl.prefix + '_total'] == null">
    Calculating...
  </div>
</div>`
  };
}
