// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as obj from 'intel-obj';
import * as fp from 'intel-fp';

import type {
  HighlandStreamT
} from 'highland';

type statT = {
  data:{
    [key:string]:number
  },
  ts:string
};

type sumT = (xs:Array<statT[]>) => Array<statT>
const sum:sumT = fp
  .map(
    fp
      .chainL((a:statT, b:statT) =>
        obj.reduce(
          () => ({
            ...a
          }),
          (v:number, k:string, o:statT):statT => ({
            ...o,
            data: {
              ...o.data,
              [k]: (o.data[k] || 0) + v
            }
          }),
          b.data
        )
      )
    );

type statStreamT = HighlandStreamT<statT>;
export default (s:statStreamT):statStreamT =>
  s
    .group('ts')
    .map(
      fp.flow(
        obj.values,
        sum
      )
    )
    .flatten();
