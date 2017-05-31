// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

import type {
  HighlandStreamT
} from 'highland';

export function throwIfServerErrors (fn:Function) {
  return (objects:Object[]) => {
    const errors = objects
      .map(x => x.error)
      .filter(Boolean);

    if (errors.length)
      throw new Error(
        JSON.stringify(
          errors
        )
      );

    return fn(objects);
  };
}

export const getCommandAndHost = (s:HighlandStreamT<{ objects:Object[] }>) => {
  return s
    .map(x => x.objects)
    .map(throwIfServerErrors(fp.identity))
    .flatten()
    .map(x => x.command_and_host)
    .collect();
};
