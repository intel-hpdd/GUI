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

import { formatNumber, formatBytes } from '@mfl/number-formatters';
import angular from 'angular';
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
  .module('filters', [])
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
