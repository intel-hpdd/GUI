//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function paginate () {
  'ngInject';

  /**
   * The pagination filter, which returns the entries according to the page the guest is viewing and the number of
   * items that can be displayed on that page.
   * @param {Array} input
   * @param {Number} currentPage
   * @param {Number} itemsPerPage
   * @returns {Array}
   */
  return function paginateFilter (input, currentPage, itemsPerPage) {
    var startingItem = itemsPerPage * currentPage;
    var endingItem = startingItem + itemsPerPage - 1;

    return input.filter(showValidItems(startingItem, endingItem));
  };

  /**
   * Returns a function that is used for filtering only the items that should be displayed on the current page.
   * @param {Number} startingItem
   * @param {Number} endingItem
   * @returns {Function}
   */
  function showValidItems (startingItem, endingItem) {
    /**
     * Computes whether or not the current item should be displayed.
     * @param {*} val
     * @param {Number} index
     */
    return function innerShowValidItems (val, index) {
      return index >= startingItem && index <= endingItem;
    };
  }
}
