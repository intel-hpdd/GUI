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
import * as obj from 'intel-obj';
import * as math from 'intel-math';
import * as maybe from 'intel-maybe';

import type { HighlandStreamT } from 'highland';

type mapT = {
  [key: string]: number
};

type dataT = {
  data: mapT,
  ts: string
};

type flatDataT = {
  data: number,
  id: string
};

type metricDataT = {
  id: string,
  data: {
    average: number,
    max: number,
    min: number
  }
};

export const reduceToStruct = obj.reduceArr(
  () => [],
  (data: mapT, id: string, out: flatDataT[]) =>
    out.concat({
      data,
      id
    })
);

export const normalize = (
  s: HighlandStreamT<dataT>
): HighlandStreamT<flatDataT> =>
  s.map(fp.flow((x: dataT) => x.data, reduceToStruct)).flatten();

export const calculateData = (
  s: HighlandStreamT<flatDataT>
): HighlandStreamT<metricDataT[]> =>
  s
    .group('id')
    .map(
      obj.map((xs: flatDataT[]): {
        average: number,
        min: number,
        max: number
      } => ({
        average: math.averageBy((x: flatDataT) => x.data, xs),
        min: math.minBy((x: flatDataT) => x.data, xs),
        max: math.maxBy((x: flatDataT) => x.data, xs)
      }))
    )
    .map(reduceToStruct);

export const collectById = (
  streams: HighlandStreamT<HighlandStreamT<{
    [key: string]: number,
    id: string
  }[]>>
): HighlandStreamT<{ [key: string]: number, id: string }[]> =>
  streams.merge().flatten().collect().map(
    fp.reduce([], (arr, curr: { [key: string]: number, id: string }) => {
      const r = maybe.map(
        x => {
          Object.assign(x, curr);
          return arr;
        },
        fp.find(x => x.id === curr.id, arr)
      );

      return maybe.withDefault(
        () => {
          arr.push({
            ...curr
          });

          return arr;
        },
        r
      );
    })
  );
