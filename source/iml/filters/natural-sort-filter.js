//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Immutable from "seamless-immutable";

export default function naturalSort() {
  "ngInject";
  const re = /([a-zA-Z]+)|([0-9]+)/g;
  let getStringToSort;

  /**
   * Sorts in natural order as opposed to lexical order
   * @param {Array} input
   * @param {Function} predicate Used to retrieve the value in context
   * @param {Boolean} reverse Indicates if the sorted array should be reversed
   */
  return function orderArrayUsingNaturalSort(input, predicate, reverse) {
    const isImmutable = Immutable.isImmutable(input);
    input = isImmutable ? Immutable.asMutable(input) : input;

    getStringToSort = predicate;
    let sortedArray = input.sort(naturalSortAlgorithm);

    if (reverse === true) sortedArray.reverse();

    sortedArray = isImmutable ? Immutable(sortedArray) : sortedArray;
    return sortedArray;
  };

  /**
   * Performs the natural sort algorithm
   * @param {String|Number} a
   * @param {String|Number} b
   * @returns {String|Number}
   */
  function naturalSortAlgorithm(a, b) {
    const componentsInA = splitStringIntoComponents(getStringToSort(a));
    const componentsInB = splitStringIntoComponents(getStringToSort(b));

    let result = 0;
    let pos = 0;

    do {
      result = calculateResult(pos, componentsInA, componentsInB);
      pos += 1;
    } while (result === 0);

    return result;
  }

  /**
   * Calculates the result based on the component values.
   * @param {Number} pos
   * @param {Array} componentsInA
   * @param {Array} componentsInB
   * @returns {Number}
   */
  function calculateResult(pos, componentsInA, componentsInB) {
    let result = 0;

    if (pos >= componentsInA.length) {
      result = -1;
    } else if (pos >= componentsInB.length) {
      result = 1;
    } else if (typeof componentsInA[pos] === "number" && typeof componentsInB[pos] === "string") {
      result = -1;
    } else if (typeof componentsInA[pos] === "string" && typeof componentsInB[pos] === "number") {
      result = 1;
    } else {
      result = calculateValueForALessThanB(componentsInA[pos], componentsInB[pos]);
      result = calculateValueForAEqualB(componentsInA[pos], componentsInB[pos], result);
    }

    return result;
  }

  /**
   * returns -1 if a < b. Returns 1 otherwise.
   * @param {Number|String} a
   * @param {Number|String} b
   * @returns {Number}
   */
  function calculateValueForALessThanB(a, b) {
    return a < b ? -1 : 1;
  }

  /**
   * Returns 0 if a and b are equal. Returns the passed in result otherwise.
   * @param {Number|String} a
   * @param {Number|String} b
   * @param {Number} result
   * @returns {Number}
   */
  function calculateValueForAEqualB(a, b, result) {
    return a === b ? 0 : result;
  }

  /**
   * Splits the passed in string into components in a way such that strings and numbers
   * are separated.
   * @example
   * 'alpha123beta7gamma' => ['alpha', 123, 'beta', 7, 'gamma']
   * @param {String|Number}val
   * @returns {Array}
   */
  function splitStringIntoComponents(val) {
    if (typeof val === "number") return [val];

    let m;
    const components = [];
    while ((m = re.exec(val)) != null) {
      if (m.index === re.lastIndex) re.lastIndex += 1;

      components.push(isNaN(m[0]) ? m[0] : +m[0]);
    }

    return components;
  }
}
