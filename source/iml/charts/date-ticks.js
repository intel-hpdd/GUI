//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from 'intel-lodash-mixins';
import moment from 'moment';

export default (d3) => {
  'ngInject';

  const month = d3.time.format('%b %d %H:%M');
  const day = d3.time.format('%d %H:%M:%S');
  const hour = d3.time.format('%H:%M:%S');

  const formatter = _.partialRight(_.compose, toMoment);

  return {
    /**
     * Given a range from moment#twix returns a function used to format the ticks.
     * @param {Object|Array} range If an Array converts into a twix range.
     * @returns {Function}
     */
    getTickFormatFunc: function getTickFormatFunc (range) {
      if (Array.isArray(range))
        range = moment(range[0]).twix(range[1]);

      if (!range.isSame('month'))
        return formatter(month);

      if (!range.isSame('day'))
        return formatter(day);

      return formatter(hour);
    }
  };

  function toMoment (d) {
    return moment(d).utc().toDate();
  }
};
