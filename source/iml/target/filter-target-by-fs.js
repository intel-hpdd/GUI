// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

const viewLens = fp.flow(fp.lensProp, fp.view);

export default function filterTargetByFs (id:number) {
  var idLens = fp.lensProp('id');
  var fsLens = viewLens('filesystems');
  var fsIdLens = viewLens('filesystem_id');
  var findById = fp.find(fp.eqFn(Number.parseInt, fp.view(idLens), id));

  var getData = fp.cond(
    [fp.flow(fsLens, Array.isArray), fsLens],
    [fp.always(true), fp.flow(fsIdLens, (x) => { return { id: x }; }, fp.arrayWrap)]
  );

  var filter = fp.filter(fp.flow(getData, findById));

  return fp.map(filter);
}
