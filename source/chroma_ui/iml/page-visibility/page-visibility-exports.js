// @flow

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

import * as fp from 'intel-fp/fp';

export default function pageVisibilityFactory ($document:Array<Document>, $timeout:Function):Function {
  'ngInject';

  return function pageVisibility (onHide:Function, onShow:Function, timeout:number):Function {
    const doc = $document[0];

    const timeoutState = {};
    const timeoutLens = fp.lensProp('cancelled');

    const setCancelled = fp.flow(
      fp.partial(0, $timeout, [onHide, timeout, false]),
      timeoutLens.set(fp.__, timeoutState)
    );

    const cancelTimeout = fp.flow(
      fp.partial(0, timeoutLens, [timeoutState]),
      fp.bindMethod('cancel', $timeout)
    );

    const onVisibilityChange = fp.partial(0, fp.cond(
      [fp.lensProp('hidden'), setCancelled],
      [fp.flow(cancelTimeout, fp.not), fp.partial(0, onShow, [])]
    ), [doc]);

    doc.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelTimeout();
      doc.removeEventListener('visibilitychange', onVisibilityChange);
    };
  };
}
