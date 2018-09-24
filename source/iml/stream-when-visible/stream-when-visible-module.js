// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";

import highlandModule from "../highland/highland-module";

import { streamWhenVisible, documentHidden, documentVisible } from "./stream-when-visible";

import type { HighlandStreamT } from "highland";

export type streamWhenChartVisibleT = (streamFn: () => HighlandStreamT<mixed>) => HighlandStreamT<mixed>;

export default angular
  .module("streamWhenVisible", [highlandModule])
  .factory("streamWhenVisible", streamWhenVisible)
  .value("documentHidden", documentHidden)
  .value("documentVisible", documentVisible).name;
