//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from 'intel-lodash-mixins';
import moment from 'moment';

export default function heatMap (dateTicks, getHeatMapChart, baseChart) {
  'ngInject';

  return baseChart({
    generateChart: getHeatMapChart,
    afterUpdate: function afterUpdate (chart) {
      var xAxis = chart.xAxis();
      var domain = xAxis.scale().domain();
      var range = moment(domain[0]).twix(_.last(domain));

      xAxis
        .tickFormat(dateTicks.getTickFormatFunc(range));

      chart.xAxisLabel(range.format({
        implicitYear: false,
        twentyFourHour: true
      }));
    }
  });
}
