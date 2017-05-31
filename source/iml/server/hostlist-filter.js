//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from 'intel-lodash-mixins';

export default function hostlistFilterFactory (pdshFilter, naturalSortFilter) {
  'ngInject';

  var getter = _.property('address');
  var state = {
    hosts: null,
    hash: null,
    fuzzy: null,
    reverse: null
  };

  var hostlistFilter = {
    compute: function compute () {
      var pdshFilterResults = pdshFilter(state.hosts, state.hash, getter, state.fuzzy);
      return naturalSortFilter(pdshFilterResults, getter, state.reverse);
    }
  };

  Object.keys(state).reduce(function (hostlistFilter, key) {
    hostlistFilter['set' + _.capitalize(key)] = function setter (newVal) {
      state[key] = newVal;

      return this;
    };

    return hostlistFilter;
  }, hostlistFilter);

  return hostlistFilter;
}
