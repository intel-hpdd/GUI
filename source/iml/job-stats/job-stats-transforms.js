// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';
import * as obj from 'intel-obj';
import * as math from 'intel-math';

import type {
  HighlandStreamT
} from 'highland';

type mapT = {
  [key:string]:number
};

type dataT = {
  data:mapT,
  ts:string
};

type flatDataT = {
  data:number,
  id:string
}

type reduceFnT = (x:mapT) => flatDataT[];

export const reduceToStruct:reduceFnT = obj.reduceArr(
  () => [],
  (data:mapT, id:string, out:flatDataT[]) =>
    out.concat({
      data,
      id
    })
);

export const normalize = (s:HighlandStreamT<dataT>) =>
  s
  .map(
    fp.flow(
      (x:dataT) => x.data,
      reduceToStruct
    )
  )
  .flatten();

export const calculateData = (s:HighlandStreamT<flatDataT[]>) =>
  s
  .group('id')
  .map(
    obj.map(
      (xs:flatDataT[]):{average:number, min:number, max:number} => ({
        average: math.averageBy((x:flatDataT) => x.data, xs),
        min: math.minBy((x:flatDataT) => x.data, xs),
        max: math.maxBy((x:flatDataT) => x.data, xs)
      })
    )
  )
  .map(reduceToStruct);


export const collectById = (
    streams:HighlandStreamT<HighlandStreamT<flatDataT[]>>
  ):HighlandStreamT<{id:string, [key:string]:number }> =>
    streams
    .merge()
    .flatten()
    .collect()
    .map(fp.reduce([], (arr, curr) => {
      const v = fp.find(x => x.id === curr.id, arr);

      if (v)
        Object.assign(v, curr);
      else
        arr.push({
          ...curr
        });

      return arr;
    }));
