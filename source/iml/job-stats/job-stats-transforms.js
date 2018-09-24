// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import * as math from "@iml/math";
import * as maybe from "@iml/maybe";
import { entries } from "@iml/obj";

import type { Exact } from "../../flow-workarounds";

import type { HighlandStreamT } from "highland";

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

export const normalize = (s: HighlandStreamT<Data>): HighlandStreamT<FlatData> =>
  s
    .map(
      fp.flow(
        (x: Data) => x.data,
        reduceToStruct
      )
    )
    .flatten();

export const calculateData = (s: HighlandStreamT<FlatData>): HighlandStreamT<MetricData[]> =>
  s.group("id").map((x: {| [key: string]: FlatData[] |}) =>
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
  streams
    .merge()
    .flatten()
    .collect()
    .map(xs =>
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
