// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';
import statusQsToOldQsParser from './status-qs-to-old-qs-parser.js';
import parserPermutations from '../parser-permutations.js';

import * as fp from '@iml/fp';

import { resolveStream } from '../promise-transforms.js';

import type { qsFromLocationT } from '../qs-from-location/qs-from-location-module.js';

export const statusState = {
  name: 'app.status',
  data: {
    helpPage: 'Graphical_User_Interface_9_0.html#9.6',
    anonymousReadProtected: true,
    eulaState: true
  },
  template: `
  <div class="status container container-full">
    <ui-loader-view></ui-loader-view>
  </div>
  `
};

export const queryState = {
  name: 'app.status.query',
  component: 'statusQuery'
};

export const tableState = {
  name: 'app.status.query.table',
  url: `/status?${parserPermutations([
    'severity',
    'record_type',
    'active',
    'offset',
    'limit',
    'order_by',
    'begin',
    'end'
  ])}`,
  params: {
    resetState: {
      dynamic: true,
      value: true,
      squash: true
    }
  },
  data: {
    kind: 'Status',
    icon: 'fa-tachometer'
  },
  resolve: {
    notification$(qsFromLocation: qsFromLocationT, $stateParams: Object) {
      'ngInject';
      const qsFromLocationToOld = fp.flow(
        qsFromLocation,
        statusQsToOldQsParser
      );

      let qs = qsFromLocationToOld($stateParams);

      if (qs.length) qs = '?' + qs;

      return resolveStream(socketStream('/alert/' + qs));
    }
  },
  component: 'statusRecords'
};
