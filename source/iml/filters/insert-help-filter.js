//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { sprintf } from 'sprintf-js';

const regexp = /%\(.+\)s/;

export default function insertHelpFilterFilter($sce, help) {
  'ngInject';
  return function insertHelpFilter(key, params) {
    let wrapper = help.get(key);
    const value = wrapper.valueOf();

    if (regexp.test(value) && params)
      wrapper = $sce.trustAsHtml(sprintf(value, params));

    return wrapper;
  };
}
