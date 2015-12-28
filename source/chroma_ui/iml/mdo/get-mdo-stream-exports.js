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

import {lensProp, map} from 'intel-fp/fp';
import {reduce} from 'intel-obj/obj';

export function getMdoStreamFactory (λ, socketStream, chartPlugins) {
  'ngInject';

  var statsPrefixRegex = /^stats_/;
  const dataLens = lensProp('data');
  const alwaysObjectLiteral = () => { return {}; };
  const stripStatsPrefix = dataLens.map(reduce(alwaysObjectLiteral, (value, key, result) => {
    var newKey = key.trim().replace(statsPrefixRegex, '');
    result[newKey] = value;
    return result;
  }));

  const stats = [
    'close',
    'getattr',
    'getxattr',
    'link',
    'mkdir',
    'mknod',
    'open',
    'rename',
    'rmdir',
    'setattr',
    'statfs',
    'unlink'
  ];

  const prependStats = ''.concat.bind('stats_');
  const metrics = map(prependStats, stats)
    .join(',');

  return function getMdoStream (requestRange, buff) {
    const s = λ((push, next) => {
      var params = requestRange({
        qs: {
          reduce_fn: 'sum',
          kind: 'MDT',
          metrics
        }
      });

      socketStream('/target/metric', params, true)
        .flatten()
        .map(stripStatsPrefix)
        .through(buff)
        .through(requestRange.setLatest)
        .through(chartPlugins.removeDups)
        .through(chartPlugins.toNvd3(stats))
        .each(function pushData (x) {
          push(null, x);
          next();
        });
    });

    const s2 = s.ratelimit(1, 10000);

    s2.destroy = s.destroy.bind(s);

    return s2;
  };
}
