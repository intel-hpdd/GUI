// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from "highland";

import type { HighlandStreamT } from "highland";

const empty = {};

export default function multiStream(streams: $ReadOnlyArray<HighlandStreamT<*>>) {
  return highland(function(push: (e: ?Error, any) => void) {
    const s: HighlandStreamT<mixed[]> = this;

    const data: any = streams.map(() => empty);

    streams.forEach((s2: HighlandStreamT<*>, index: number) => {
      s.onDestroy(s2.destroy.bind(s2));

      s2.errors(e => push(e)).each(x => {
        data[index] = x;

        if (data.indexOf(empty) === -1) push(null, [...data]);
      });
    });
  });
}

type MultiStream2<A, B> = ([HighlandStreamT<A>, HighlandStreamT<B>]) => HighlandStreamT<[A, B]>;

export const multiStream2: MultiStream2<*, *> = xs => (multiStream(xs): any);
