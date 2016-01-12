//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import angular from 'angular';


angular.module('charts').factory('dateTicks', ['d3', 'moment', function (d3, moment) {
  'use strict';

  var month = d3.time.format('%b %d %H:%M');
  var day = d3.time.format('%d %H:%M:%S');
  var hour = d3.time.format('%H:%M:%S');

  var formatter = _.partialRight(_.compose, toMoment);

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
}]);
