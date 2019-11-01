//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from "highland";
import { API } from "../environment.js";

export const metricPoll = () => {
  const s$ = highland(async (push, next) => {
    try {
      const r = await fetch(`${API}targets/metrics`);
      const data = await r.json();
      push(null, data.objects);
    } catch (err) {
      push(err);
    }

    setTimeout(() => next(), 10000);
  });

  return s$;
};
