// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

const viewLens = fp.flow(fp.lensProp, fp.view);

export default function filterTargetByFs(id: number) {
  const idLens = fp.lensProp('id');
  const fsLens = viewLens('filesystems');
  const fsIdLens = viewLens('filesystem_id');
  const findById = fp.find(fp.eqFn(Number.parseInt, fp.view(idLens), id));

  const getData = fp.cond(
    [fp.flow(fsLens, Array.isArray), fsLens],
    [
      fp.always(true),
      fp.flow(
        fsIdLens,
        x => {
          return { id: x };
        },
        fp.arrayWrap
      )
    ]
  );

  const filter = fp.filter(fp.flow(getData, findById));

  return fp.map(filter);
}
