// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import formatBytes from '../number-formatters/format-bytes.js';
import formatNumber from '../number-formatters/format-number.js';
import angular from 'angular';
import helpModule from '../help-module';
import pdshFilter from './pdsh-filter';
import capitalizeFilter from './capitalize-filter';
import insertHelpFilter from './insert-help-filter';
import naturalSortFilter from './natural-sort-filter';
import paginateFilter from './paginate-filter';
import pathMaxLengthFilter from './path-max-length-filter';
import roundFilter from './round-filter';
import throughputFilter from './throughput-filter';
import toDateFilter from './to-date-filter.js';

export default angular
  .module('filters', [helpModule])
  .filter('fmtBytes', () => formatBytes)
  .filter('fmtNumber', () => formatNumber)
  .filter('capitalize', capitalizeFilter)
  .filter('pdsh', pdshFilter)
  .filter('insertHelp', insertHelpFilter)
  .filter('naturalSort', naturalSortFilter)
  .filter('paginate', paginateFilter)
  .filter('pathMaxLength', pathMaxLengthFilter)
  .filter('round', roundFilter)
  .filter('throughput', throughputFilter)
  .filter('toDate', () => toDateFilter).name;
