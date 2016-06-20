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

import socketStream from '../socket/socket-stream.js';
import * as fp from 'intel-fp';
import highland from 'highland';
import unionWithTarget from '../charting/union-with-target.js';
import objToPoints from '../charting/obj-to-points.js';
import removeDupsBy from '../charting/remove-dups-by.js';

import {
  values
} from 'intel-obj';

const viewLens = fp.flow(fp.lensProp, fp.view);

var headName = fp.flow(fp.head, viewLens('name'));
var compareLocale = fp.flow(
    fp.invokeMethod('reverse', []),
    fp.over(fp.lensProp(0), fp.arrayWrap),
    fp.invoke(fp.invokeMethod('localeCompare'))
  );
var cmp = fp.wrapArgs(
  fp.flow(
    fp.map(headName),
    fp.chainL(fp.wrapArgs(compareLocale))
  )
);
var sortOsts = fp.invokeMethod('sort', [cmp]);

export default fp.curry(3, function getReadWriteHeatMapStream (type, requestRange, buff) {
  var s = highland(function generator (push, next) {
    var params = requestRange({
      qs: {
        kind: 'OST',
        metrics: type
      }
    });

    const idLens = viewLens('id');

    socketStream('/target/metric', params, true)
      .through(objToPoints)
      .through(buff)
      .through(unionWithTarget)
      .through(requestRange.setLatest)
      .flatten()
      .through(removeDupsBy(fp.eqFn(idLens, idLens)))
      .group('id')
      .map(values)
      .map(sortOsts)
      .each(function pushData (x) {
        push(null, x);
        next();
      });
  });

  const s2 = s.ratelimit(1, 10000);

  s2.destroy = s.destroy.bind(s);

  return s2;
});
