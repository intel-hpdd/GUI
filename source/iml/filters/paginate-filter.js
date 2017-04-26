//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function paginate() {
  'ngInject';
  return function paginateFilter(input, currentPage, itemsPerPage) {
    const startingItem = itemsPerPage * currentPage;
    const endingItem = startingItem + itemsPerPage - 1;

    return input.filter(showValidItems(startingItem, endingItem));
  };

  function showValidItems(startingItem, endingItem) {
    return function innerShowValidItems(val, index) {
      return index >= startingItem && index <= endingItem;
    };
  }
}
