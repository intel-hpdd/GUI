//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

import chartsContainerTemplate from './assets/html/charts-container.html!text';

export const chartsContainer = fp.always({
  restrict: 'E',
  scope: {
    charts: '='
  },
  template: chartsContainerTemplate
});
