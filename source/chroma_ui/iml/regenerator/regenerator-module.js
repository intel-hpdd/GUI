//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2014 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.


angular.module('regenerator-module', [])
  .factory('regenerator', [function regeneratorFactory () {
    'use strict';

    /**
     * returns a function that regenerates an item
     * with the provided setup and teardown
     * functions.
     * @param {Function} setup
     * @param {Function} teardown
     * @returns {Function}
     */
    return function regenerator (setup, teardown) {
      var cache = {};

      var getter = function get () {
        var args = [].slice.call(arguments, 0);
        var key = args.shift();

        if (cache[key]) {
          teardown(cache[key]);
          delete cache[key];
        }

        return (cache[key] = setup.apply(setup, args));
      };

      getter.destroy = function destroy () {
        Object.keys(cache).forEach(function teardownItem (key) {
          teardown(cache[key]);
        });

        cache = setup = teardown = null;
      };

      return getter;
    };
  }
]);
