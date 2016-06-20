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
import highland from 'highland';
import removeDups from '../charting/remove-dups.js';
import toNvd3 from '../charting/to-nvd3.js';

export default (requestRange, buff) => {
  var s = highland((push, next) => {
    var params = requestRange({
      qs: {
        metrics: 'kbytestotal,kbytesfree',
        reduce_fn: 'average'
      }
    });

    var key = 'Space Used';

    socketStream('/target/metric', params, true)
      .flatten()
      .tap(function calculateCpuAndRam (x) {
        x.data[key] = (x.data.kbytestotal - x.data.kbytesfree) / x.data.kbytestotal;
      })
      .through(buff)
      .through(requestRange.setLatest)
      .through(removeDups)
      .through(toNvd3([key]))
      .each(function pushData (x) {
        push(null, x);
        next();
      });
  });

  const s2 = s.ratelimit(1, 10000);

  s2.destroy = s.destroy.bind(s);

  return s2;
};
