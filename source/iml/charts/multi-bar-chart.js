//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function multiBarChart(baseChart) {
  'ngInject';
  return baseChart({
    generateChart: function generateChart(nv) {
      return nv.models.multiBarChart();
    }
  });
}
