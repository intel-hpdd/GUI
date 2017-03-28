// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import highlandModule from '../highland/highland-module';
import d3Module from '../d3/d3-module';
import chartCompilerModule from '../chart-compiler/chart-compiler-module';
import createStream from './create-stream';

import type { HighlandStreamT } from 'highland';
export type bufferDataNewerThanT = (size: number, unit: string) => (
  s: HighlandStreamT<mixed>
) => HighlandStreamT<mixed>;
export type sortByDateT = (
  stream: HighlandStreamT<mixed>
) => HighlandStreamT<mixed>;
export type createStreamT = {
  durationStream: Function,
  rangeStream: Function
};

export default angular
  .module('charting', [highlandModule, d3Module, chartCompilerModule])
  .factory('createStream', createStream).name;
