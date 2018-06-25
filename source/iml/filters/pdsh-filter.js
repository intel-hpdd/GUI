//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function pdsh() {
  'ngInject';
  /**
   * Given an array of objects, return a list of objects that match the list of host names.
   * @param {Array} [input]
   * @param {Object} [hostnamesHash]
   * @param {Function} hostPath Function used to retrieve the hostName property from the object passed in
   * @param {Boolean} [fuzzy] Indicates if the filtering should be done on a fuzzy match.
   * @returns {Array}
   */
  return function pdshExpander(input, hostnamesHash, hostPath, fuzzy) {
    input = input || [];
    hostnamesHash = hostnamesHash || {};
    const hostnames = Object.keys(hostnamesHash);

    const filteredItems = input.filter(filterInputByHostName(hostnamesHash, hostnames, hostPath, fuzzy));

    return hostnames.length > 0 ? filteredItems : input;
  };

  /**
   * Filters the input by the host name
   * @param {Object} hostnamesHash
   * @param {Array} hostnames
   * @param {Function} hostPath
   * @param {Boolean} fuzzy
   * @returns {Function}
   */
  function filterInputByHostName(hostnamesHash, hostnames, hostPath, fuzzy) {
    /**
     * Filters the input by the host name
     * @param {String} item
     * @returns {Boolean}
     */
    return function innerFilterInputByHostName(item) {
      if (fuzzy) {
        const matches = hostnames.filter(filterCurrentItemByHostNameList(hostPath(item), fuzzy));
        return matches.length > 0;
      } else {
        return hostnamesHash[hostPath(item)] != null;
      }
    };
  }

  /**
   * Filters on the current item by the host name list
   * @param {String} item
   * @param {Boolean} fuzzy
   * @returns {Function}
   */
  function filterCurrentItemByHostNameList(item, fuzzy) {
    /**
     * Filters on the current item by the host name list
     * @param {String} hostname
     * @returns {Boolean}
     */
    return function innerFilterCurrentItemByHostNameList(hostname) {
      return fuzzy === true ? item.indexOf(hostname) > -1 : item === hostname;
    };
  }
}
