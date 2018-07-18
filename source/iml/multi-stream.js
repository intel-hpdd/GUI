// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from 'highland';
import * as fp from '@iml/fp';

import type { HighlandStreamT } from 'highland';

const empty = {};

export default function multiStream(streams: any) {
  return highland(function(push) {
    const s: HighlandStreamT<mixed[]> = this;

    const data: any = fp.map(fp.always(empty))(streams);

    streams.forEach((s2, index: number) => {
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
