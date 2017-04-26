//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';

const adder = xs => y => {
  const record = xs.find(x => x.id === y.id);

  if (record && record.name) y.name = record.name;

  return y;
};

export default function unionWithTarget(s) {
  const targetStream = socketStream(
    '/target',
    {
      qs: { limit: 0 },
      jsonMask: 'objects(id,name)'
    },
    true
  ).pluck('objects');

  return s
    .collect()
    .zip(targetStream)
    .flatMap(([xs1, xs2]) => xs1.map(adder(xs2)));
}
