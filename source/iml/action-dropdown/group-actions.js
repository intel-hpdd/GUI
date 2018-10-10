//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";

import Immutable from "seamless-immutable";

export default function groupActionsFilter() {
  const numDisplayGroups = fp.flow(
    fp.map(fp.view(fp.lensProp("display_group"))),
    fp.filter(
      fp.flow(
        fp.eq(undefined),
        fp.not
      )
    ),
    fp.view(fp.lensProp("length"))
  );

  // Sort items by display_group, then by display_order.
  // Mark the last item in each group
  return function groupActions(input) {
    if (numDisplayGroups(input) !== input.length) return input;

    const isImmutable = Immutable.isImmutable(input);
    input = isImmutable ? Immutable.asMutable(input, { deep: true }) : input;

    let sorted = input.sort(function(a, b) {
      const x = a.display_group - b.display_group;
      return x === 0 ? a.display_order - b.display_order : x;
    });

    sorted.forEach(function(item, index) {
      const next = sorted[index + 1];

      if (next && item.display_group !== next.display_group) item.last = true;
    });

    sorted = isImmutable ? Immutable(sorted) : sorted;
    return sorted;
  };
}
