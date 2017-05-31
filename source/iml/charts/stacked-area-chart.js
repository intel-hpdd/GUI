//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import moment from 'moment';

export default function stackedAreaChart (d3, dateTicks, baseChart) {
  'ngInject';

  var colors = d3.scale.category20c();

  function keyColor (d) { return colors(d.key); }

  return baseChart({
    generateChart: function (nv) {
      return nv.models.stackedAreaChart()
        .color(keyColor)
        .clipEdge(true);
    },
    onUpdate: function onUpdate (chart, data) {
      if (!Array.isArray(data) || !data[0]) return;

      var values = data[0].values;

      if (!Array.isArray(values) || !values[0]) return;

      var start = values[0].x,
        end = values[values.length - 1].x,
        range = moment(start).twix(end);

      chart.xAxis
        .axisLabel(range.format({implicitYear: false, twentyFourHour: true}))
        .ticks(5)
        .showMaxMin(false)
        .tickFormat(dateTicks.getTickFormatFunc(range));
    }
  });
}
