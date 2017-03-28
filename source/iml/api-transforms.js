// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

export function addCurrentPage<T: { meta: Object }>(o: T): T {
  return {
    ...o,
    meta: {
      ...o.meta,
      current_page: o.meta.limit === 0 ? 1 : o.meta.offset / o.meta.limit + 1
    }
  };
}

export const rememberValue = fp.curry2((transformFn, in$) => {
  let v;

  return in$
    .tap(x => v = x)
    .flatMap(transformFn)
    .map(() => v)
    .otherwise(() => [v]);
});

export const matchById = (id: string) => fp.find(x => x.id === id);
