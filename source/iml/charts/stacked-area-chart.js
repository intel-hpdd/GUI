//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import moment from "moment";
import d3 from "d3";

export default function stackedAreaChart(dateTicks, baseChart) {
  "ngInject";
  const colors = d3.scale.category20c();

  function keyColor(d) {
    return colors(d.key);
  }

  return baseChart({
    generateChart: function(nv) {
      return nv.models
        .stackedAreaChart()
        .color(keyColor)
        .clipEdge(true);
    },
    onUpdate: function onUpdate(chart, data) {
      if (!Array.isArray(data) || !data[0]) return;

      const values = data[0].values;

      if (!Array.isArray(values) || !values[0]) return;

      const start = values[0].x;
      const end = values[values.length - 1].x;
      const range = moment(start).twix(end);

      chart.xAxis
        .axisLabel(range.format({ implicitYear: false, twentyFourHour: true }))
        .ticks(5)
        .showMaxMin(false)
        .tickFormat(dateTicks.getTickFormatFunc(range));
    }
  });
}
