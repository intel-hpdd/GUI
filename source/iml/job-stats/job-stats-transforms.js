// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

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
