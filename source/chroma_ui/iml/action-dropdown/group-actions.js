//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
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

import angular from 'angular';

import {flow, map, filter, eq, not, lensProp} from 'intel-fp/fp';

angular.module('action-dropdown-module')
  .filter('groupActions', function groupActionsFilter () {
    var numDisplayGroups = flow(
      map(lensProp('display_group')),
      filter(flow(eq(undefined), not)),
      lensProp('length')
    );

    // Sort items by display_group, then by display_order.
    // Mark the last item in each group
    return function groupActions (input) {
      if (numDisplayGroups(input) !== input.length) {
        return input;
      }

      var sorted = input.sort(function (a, b) {
        var x = a.display_group - b.display_group;
        return (x === 0 ? a.display_order - b.display_order : x);
      });

      sorted.forEach(function (item, index) {
        var next = sorted[index + 1];

        if (next && item.display_group !== next.display_group) {
          item.last = true;
        }
      });

      return sorted;
    };
  });
