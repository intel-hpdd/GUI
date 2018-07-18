//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import sortBy from './sort-by.js';

export default function sortByDate(s) {
  return s.through(
    sortBy(function byDate(a, b) {
      return new Date(a.ts) - new Date(b.ts);
    })
  );
}
