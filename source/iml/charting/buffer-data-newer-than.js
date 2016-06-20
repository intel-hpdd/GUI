// @flow

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

import {curry} from 'intel-fp';
import getServerMoment from '../get-server-moment.js';
import sortByDate from './sort-by-date.js';

export default curry(2, function bufferDataNewerThan (size, unit) {
  var buffer = [];

  return function bufferDataNewerThanInner (s) {
    var leadingEdge;

    return s
      .collect()
      .tap(function assignLeadingEdge () {
        leadingEdge = getServerMoment()
          .milliseconds(0).subtract(size, unit);

        var secs = leadingEdge.seconds();
        leadingEdge.seconds(secs - (secs % 10));

        leadingEdge = leadingEdge.valueOf();
      })
      .flatMap(function concatData (x) {
        return buffer.concat(x);
      })
      .filter(function removeStaleData (point) {
        return new Date(point.ts).valueOf() >= leadingEdge;
      })
      .through(sortByDate)
      .collect()
      .tap(function assignBuffer (x) {
        buffer = x;
      })
      .flatten();
  };
});
