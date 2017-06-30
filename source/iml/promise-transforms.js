// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';

import type { HighlandStreamT, errorWrapT } from 'highland';

export function resolveStream<T>(
  stream: HighlandStreamT<T>
): Promise<HighlandStreamT<T>> {
  return new Promise(resolve => {
    stream.pull((error, x) => {
      if (error)
        x = ({
          __HighlandStreamError__: true,
          error
        }: errorWrapT);

      const s2 = stream.tap(fp.noop);
      s2.write(x);

      // $FlowFixMe: flow does not recognize this monkey-patching.
      s2.destroy = stream.destroy.bind(stream);

      resolve(s2);
    });
  });
}

export function streamToPromise<A>(s: HighlandStreamT<A>): Promise<A> {
  return new Promise((resolve, reject) =>
    s.pull((err: Error, x: A) => {
      if (err) reject(err);
      else resolve(x);
    })
  ).then(x => {
    s.destroy();
    return x;
  });
}
