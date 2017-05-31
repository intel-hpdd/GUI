//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';

import {
  curry
} from 'intel-fp';

import _ from 'intel-lodash-mixins';

const adder = curry(2, function adder (s, x) {
  const record = _.find(s, { id: x.id });

  if (record && record.name)
    x.name = record.name;

  return x;
});

export default function unionWithTarget (s) {
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
}
