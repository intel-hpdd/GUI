//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@mfl/fp';

export const chartsContainer = fp.always({
  restrict: 'E',
  scope: {
    charts: '='
  },
  template: `<div class="row dashboard" sorter>
  <chart-compiler
    ng-repeat="chart in ::charts"
    class="col-lg-6 dashboard-chart full-screen"
    sort-item
    chart="::chart"
    template="::chart.template"></chart-compiler>
</div>
`
});
