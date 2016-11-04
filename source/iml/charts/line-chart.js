//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import moment from 'moment';

export default function lineChart (dateTicks, baseChart) {
  'ngInject';

  return baseChart({
    generateChart: function generateChart (nv) {
      return nv.models.lineChart();
    },
    onUpdate: function onUpdate (chart, data) {
      if (!Array.isArray(data) || !data[0]) return;

      const values = data[0].values;

      if (!Array.isArray(values) || !values[0]) return;

      const start = values[0].x;
      const end = values[values.length - 1].x;
      const range = moment(start).twix(end);

      chart.xAxis
        .axisLabel(range.format({
          implicitYear: false,
          twentyFourHour: true
        }))
        .ticks(5)
        .showMaxMin(false)
        .tickFormat(dateTicks.getTickFormatFunc(range));
    }
  });
}
