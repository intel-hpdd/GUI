// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';

import type { HighlandStreamT } from 'highland';

export function addCurrentPage<T: { meta: Object }>(o: T): T {
  return {
    ...o,
    meta: {
      ...o.meta,
      current_page: o.meta.limit === 0 ? 1 : o.meta.offset / o.meta.limit + 1
    }
  };
}

export const matchById = (id: string) => fp.find(x => x.id === parseInt(id));

type MapFn<A, B> = A => B;
export const rememberValue = <A, B, C: HighlandStreamT<B> | B[]>(
  mapFn: MapFn<A, C>
) => (in$: HighlandStreamT<A>): HighlandStreamT<A> => {
  let v;

  return in$.tap(x => (v = x)).flatMap(mapFn).map(() => v).otherwise(() => [v]);
};

export const filterSame = <A, B>(fn: B => A) => {
  let last: ?A;

  return (x: B) => {
    const current = fn(x);
    if (last === current) return false;

    last = current;

    return true;
  };
};
