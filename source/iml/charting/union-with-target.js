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
import _ from 'intel-lodash-mixins';


export default function unionWithTargetFactory (socketStream) {
  'ngInject';

  var adder = curry(2, function adder (s, x) {
    var record = _.find(s, { id: x.id });

    if (record && record.name)
      x.name = record.name;

    return x;
  });

  return function unionWithTarget (s) {
    var targetStream = socketStream('/target', {
      qs: { limit: 0 },
      jsonMask: 'objects(id,name)'
    }, true)
      .pluck('objects');

    return s
      .collect()
      .zip(targetStream)
      .flatMap(function addNames (streams) {
        return streams[0].map(adder(streams[1]));
      });
  };
}