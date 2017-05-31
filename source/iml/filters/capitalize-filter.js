//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from 'intel-lodash-mixins';

export default function capitalizeFilter () {
  'ngInject';

  return function (words, all) {
    if (!_.isString(words)) return words;

    if (all)
      words = words.trim().split(/\s+/).map(_.capitalize).join(' ');
    else
      words = _.capitalize(words);

    return words;
  };
}
