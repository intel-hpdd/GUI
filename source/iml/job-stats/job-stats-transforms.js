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

import * as fp from '@mfl/fp';
import * as math from '@mfl/math';
import * as maybe from '@mfl/maybe';
import { entries } from '@mfl/obj';

import type { Exact } from '../../flow-workarounds';

import type { HighlandStreamT } from 'highland';

type NumberMap = Exact<{
  [key: string]: number
}>;

type Data = Exact<{
  data: NumberMap,
  ts: string
}>;

type FlatData = {|
  data: number,
  id: string
|};

type MetricData = {|
  id: string,
  data: {|
    average: number,
    max: number,
    min: number
  |}
|};

export const reduceToStruct = (x: NumberMap) =>
  entries(x).reduce(
    (out: FlatData[], [id: string, data: number]) =>
      out.concat({
        data,
        id
      }),
    []
  );

export const normalize = (
  s: HighlandStreamT<Data>
): HighlandStreamT<FlatData> =>
  s.map(fp.flow((x: Data) => x.data, reduceToStruct)).flatten();

export const calculateData = (
  s: HighlandStreamT<FlatData>
): HighlandStreamT<MetricData[]> =>
  s.group('id').map((x: {| [key: string]: FlatData[] |}) =>
    entries(x).reduce(
      (out: MetricData[], [id: string, xs: FlatData[]]) =>
        out.concat({
          id,
          data: {
            average: math.averageBy((x: FlatData) => x.data, xs),
            min: math.minBy((x: FlatData) => x.data, xs),
            max: math.maxBy((x: FlatData) => x.data, xs)
          }
        }),
      []
    )
  );

export const collectById = (
  streams: HighlandStreamT<
    HighlandStreamT<
      {
        [key: string]: number,
        id: string
      }[]
    >
  >
): HighlandStreamT<{ [key: string]: number, id: string }[]> =>
  streams.merge().flatten().collect().map(xs =>
    xs.reduce((arr, curr: { [key: string]: number, id: string }) => {
      const r = maybe.map(x => {
        Object.assign(x, curr);
        return arr;
      }, fp.find(x => x.id === curr.id)(arr));

      return maybe.withDefault(() => {
        arr.push({
          ...curr
        });

        return arr;
      }, r);
    }, [])
  );
