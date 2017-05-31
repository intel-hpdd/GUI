// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const DURATIONS = {
  MINUTES: 'minutes',
  HOURS: 'hours',
  DAYS: 'days',
  WEEKS: 'weeks',
  MONTHS: 'months',
  YEARS: 'years'
};

// $FlowIgnore: HTML templates that flow does not recognize.
import durationPickerTemplate from './assets/html/duration-picker.html!text';

export default {
  scope: {},
  template: durationPickerTemplate,
  bindings: {
    type: '<',
    size: '<',
    unit: '<',
    startDate: '<',
    endDate: '<'
  },
  controller () {
    'ngInject';

    Object.assign(
        this,
      {
        units: [
          { unit: DURATIONS.MINUTES, count: 60 },
          { unit: DURATIONS.HOURS, count: 24 },
          { unit: DURATIONS.DAYS, count: 31 },
          { unit: DURATIONS.WEEKS, count: 4 },
          { unit: DURATIONS.MONTHS, count: 12 },
          { unit: DURATIONS.YEARS, count: 5 }
        ],
        getCount (unit) {
          var item = this.units
            .filter(item => item.unit === unit)
            .pop();

          if (item) return item.count;
        },
        setUnit (unit) {
          this.unit = unit;
          this.size = 1;
        }
      });
  }
};
