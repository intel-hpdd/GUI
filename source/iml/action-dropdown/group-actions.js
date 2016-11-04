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

import * as fp from 'intel-fp';

export default function groupActionsFilter () {
  const numDisplayGroups = fp.flow(
    fp.map(fp.view(fp.lensProp('display_group'))),
    fp.filter(fp.flow(fp.eq(undefined), fp.not)),
    fp.view(fp.lensProp('length'))
  );

  // Sort items by display_group, then by display_order.
  // Mark the last item in each group
  return function groupActions (input) {
    if (numDisplayGroups(input) !== input.length)
      return input;

    const sorted = input.sort(function (a, b) {
      const x = a.display_group - b.display_group;
      return (x === 0 ? a.display_order - b.display_order : x);
    });

    sorted.forEach(function (item, index) {
      const next = sorted[index + 1];

      if (next && item.display_group !== next.display_group)
        item.last = true;
    });

    return sorted;
  };
}
