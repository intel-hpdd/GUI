//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';

import * as fp from 'intel-fp';

const adder = fp.curry2(function adder (s, x) {
  const record = fp.find(y => y.id === x.id, s);

  if (record && record.name)
    x.name = record.name;

  return x;
});

export default function unionWithTarget (s) {
  const targetStream = socketStream('/target', {
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
