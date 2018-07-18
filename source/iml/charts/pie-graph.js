//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function pieGraph(baseChart) {
  'ngInject';
  return baseChart({
    generateChart: function generateChart(nv) {
      return nv.models
        .pie()
        .width(20)
        .height(20)
        .growOnHover(false);
    }
  });
}
