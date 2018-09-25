// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import bufferDataNewerThan from "./buffer-data-newer-than.js";

import { flushOnChange } from "../chart-transformers/chart-transformers.js";

import { getTimeParams } from "./get-time-params.js";

import type { streamWhenChartVisibleT } from "../stream-when-visible/stream-when-visible-module.js";

export default (streamWhenVisible: streamWhenChartVisibleT) => {
  "ngInject";
  const { getRequestRange, getRequestDuration } = getTimeParams;

  const createStreamFn = (durationFn: Function, buffFn: Function) => (overrides: Object) => (
    streamFn: Function,
    begin: number,
    end: number | string
  ) => {
    const d = durationFn(overrides);

    return flushOnChange(streamWhenVisible(() => streamFn(d(begin, end), buffFn(begin, end))));
  };

  return {
    durationStream: createStreamFn(getRequestDuration, bufferDataNewerThan),
    rangeStream: createStreamFn(getRequestRange, fp.always(fp.identity))
  };
};
