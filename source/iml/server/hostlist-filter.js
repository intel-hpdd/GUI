// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { pdshFilter } from "../filters/pdsh-filter.js";
import { naturalSortFilter } from "../filters/natural-sort-filter.js";

import { type TestHostT } from "./server-module.js";

type HashT = {
  [key: string]: 1
};

const getAddress = x => x.address;

export default function hostlistFilter() {
  let hosts: TestHostT[] = [];
  let hash: HashT = {};
  let fuzzy: boolean = false;
  let reverse: boolean = false;

  const hostlistFilter = {
    compute: () => {
      const pdshFilterResults = pdshFilter(hosts, hash, getAddress, fuzzy);
      return naturalSortFilter(pdshFilterResults, getAddress, reverse);
    },
    setHosts: (x: TestHostT[]) => {
      hosts = x;
      return hostlistFilter;
    },
    setHash: (x: HashT) => {
      hash = x;
      return hostlistFilter;
    },
    setFuzzy: (x: boolean) => {
      fuzzy = x;
      return hostlistFilter;
    },
    setReverse: (x: boolean) => {
      reverse = x;
      return hostlistFilter;
    }
  };

  return hostlistFilter;
}
