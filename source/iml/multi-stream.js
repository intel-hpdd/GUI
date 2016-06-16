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

import highland from 'highland';
import * as fp from 'intel-fp';

import type {
  HighlandStreamT
} from 'highland';

const empty = {};

export default function multiStream (streams:HighlandStreamT<mixed>[]) {
  return highland(function generator (push) {
    const s:HighlandStreamT<mixed[]> = this;

    const data:Array<mixed> = fp.map(
      fp.always(empty),
      streams
    );

    streams
      .forEach((s2:HighlandStreamT<mixed>, index:number) => {
        s._destructors.push(s2.destroy.bind(s2));

        s2
          .errors(e => push(e))
          .each((x:mixed) => {
            data[index] = x;

            if (data.indexOf(empty) === -1)
              push(null, data.slice(0));
          });
      });
  });
}
