//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {always} from 'intel-fp';


// $FlowIgnore: HTML templates that flow does not recognize.
import chartsContainerTemplate from './assets/html/charts-container.html!text';

export const chartsContainer = always({
  restrict: 'E',
  scope: {
    charts: '='
  },
  template: chartsContainerTemplate
});
