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

// @flow

import highland from 'highland';

export default function broadcaster (source$:HighlandStreamT<Object>):streamFn {
  var latest;

  const viewers = [];

  source$
    .errors(error => {
      const err = {
        __HighlandStreamError__: true,
        error
      };

      viewers.forEach(v => v.write(err));
    })
    .each(xs => {
      latest = xs;

      viewers.forEach(v => v.write(xs));
    });

  const fn = () => {
    const viewer$:HighlandStreamT<mixed> = highland()
      .onDestroy(() => {
        const idx = viewers
          .indexOf(viewer$);

        if (idx !== -1)
          viewers.splice(idx, 1);
      });

    if (latest)
      viewer$.write(latest);

    viewers.push(viewer$);

    return viewer$;
  };

  fn.endBroadcast = () => source$.destroy();

  return fn;
}
