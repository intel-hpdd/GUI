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

import * as fp from 'intel-fp';

import type {
  HighlandStreamT
} from 'highland';

export const resolveStream = (stream:HighlandStreamT<mixed>) => {
  return new Promise((resolve) => {
    stream.pull((error, x) => {
      if (error)
        x = {
          __HighlandStreamError__: true,
          error
        };

      const s2 = stream.tap(fp.noop);
      s2.write(x);

      // $FlowIgnore: flow does not recognize this monkey-patching.
      s2.destroy = stream.destroy.bind(stream);

      resolve(s2);
    });
  });
};


export function streamToPromise (s:HighlandStreamT<Object>):Promise<Object> {
  return new Promise ((resolve:Function, reject:Function) => {
    return s
    .pull((err:Error, x:Object) => {
      if (err)
        reject(err);
      else
        resolve(x);
    });
  })
  .then(fp.tap(s.destroy.bind(s)));
}

export const extendParentData = fp.curry(2,
  (parent:Object, x:Object):Object =>
    ({
      ...x,
      parent
    })
);
