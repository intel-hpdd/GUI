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

import * as obj from '@mfl/obj';
import * as fp from '@mfl/fp';

import type { HighlandStreamT } from 'highland';
import type { Exact } from '../../flow-workarounds.js';

type Point = Exact<{
  data: Exact<{
    [key: string]: number
  }>,
  ts: string
}>;

type Sum = (xs: Array<Point[]>) => Point[];
const sum: Sum = fp.map(
  fp.chainL((a: Point, b: Point) =>
    obj.entries(b.data).reduce((o: Point, [k: string, v: number]): Point => ({
      ...o,
      data: {
        ...o.data,
        [k]: (o.data[k] || 0) + v
      }
    }), { ...a })
  )
);

type Stat$ = HighlandStreamT<Point>;
export default (s: Stat$): Stat$ =>
  s.group('ts').map(fp.flow(obj.values, sum)).flatten();
