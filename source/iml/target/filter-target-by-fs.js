// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';

export default function filterTargetByFs(id: number) {
  const findById = xs => xs.find(x => id === x.id) != null;

  const getData = x => (Array.isArray(x.filesystems) ? x.filesystems : [{ id: x.filesystem_id }]);

  const filter = fp.filter(
    fp.flow(
      getData,
      findById
    )
  );

  return fp.map(filter);
}
