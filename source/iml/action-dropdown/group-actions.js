//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {flow, map, filter, eq, not, lensProp, view} from 'intel-fp';

export default function groupActionsFilter () {
  const numDisplayGroups = flow(
    map(view(lensProp('display_group'))),
    filter(flow(eq(undefined), not)),
    view(lensProp('length'))
  );

  // Sort items by display_group, then by display_order.
  // Mark the last item in each group
  return function groupActions (input) {
    if (numDisplayGroups(input) !== input.length)
      return input;

    var sorted = input.sort(function (a, b) {
      var x = a.display_group - b.display_group;
      return (x === 0 ? a.display_order - b.display_order : x);
    });

    sorted.forEach(function (item, index) {
      var next = sorted[index + 1];

      if (next && item.display_group !== next.display_group)
        item.last = true;
    });

    return sorted;
  };
}
