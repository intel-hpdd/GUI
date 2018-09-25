//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from "@iml/lodash-mixins";

export default function hostlistFilterFactory(pdshFilter, naturalSortFilter) {
  "ngInject";
  const getter = _.property("address");
  const state = {
    hosts: null,
    hash: null,
    fuzzy: null,
    reverse: null
  };

  const hostlistFilter = {
    compute: function compute() {
      const pdshFilterResults = pdshFilter(state.hosts, state.hash, getter, state.fuzzy);
      return naturalSortFilter(pdshFilterResults, getter, state.reverse);
    }
  };

  Object.keys(state).reduce(function(hostlistFilter, key) {
    hostlistFilter["set" + _.capitalize(key)] = function setter(newVal) {
      state[key] = newVal;

      return this;
    };

    return hostlistFilter;
  }, hostlistFilter);

  return hostlistFilter;
}
