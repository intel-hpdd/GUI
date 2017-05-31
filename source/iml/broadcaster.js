// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from 'highland';

import type {
  HighlandStreamT,
  errorWrapT
} from 'highland';


type streamFnT = () => HighlandStreamT<any>;

export default function broadcaster (source$:HighlandStreamT<any>):streamFnT {
  var latest:mixed;

  const viewers = [];

  source$
    .errors(error => {
      const err:errorWrapT = {
        __HighlandStreamError__: true,
        error
      };

      viewers.forEach(v => v.write(err));
    })
    .each((xs:mixed) => {
      latest = xs;

      viewers.forEach(v => v.write(xs));
    });

  const fn = () => {
    const viewer$:HighlandStreamT<any> = highland()
      .onDestroy(() => {
        const idx = viewers
          .indexOf(viewer$);

        if (idx !== -1)
          viewers.splice(idx, 1);
      });

    if (latest)
      viewer$.write(latest);

    viewers.push(viewer$);

    return viewer$;
  };

  fn.endBroadcast = () => source$.destroy();

  return fn;
}
