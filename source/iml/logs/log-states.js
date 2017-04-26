// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import parserPermutations from '../parser-permutations.js';

import socketStream from '../socket/socket-stream.js';
import statusQsToOldQsParser from '../status/status-qs-to-old-qs-parser.js';
import store from '../store/get-store.js';
import * as fp from '@mfl/fp';

import { resolveStream } from '../promise-transforms.js';

import { addHostIds } from './log-transforms.js';

import { addCurrentPage } from '../api-transforms.js';

import type { qsFromLocationT } from '../qs-from-location/qs-from-location-module.js';

export const logState = {
  name: 'app.log',
  data: {
    helpPage: 'logs_page.htm',
    anonymousReadProtected: true,
    eulaState: true
  },
  template: `
  <div class="container log container-full">
    <log-query></log-query>
    <ui-loader-view class="log-table"></ui-loader-view>
  </div>
  `
};

export const logTableState = {
  name: 'app.log.table',
  url: `/log?${parserPermutations([
    'message_class',
    'message',
    'tag',
    'fqdn',
    'datetime',
    'offset',
    'limit',
    'order_by'
  ])}`,
  params: {
    resetState: {
      dynamic: true
    }
  },
  data: {
    kind: 'Logs',
    icon: 'fa-book'
  },
  resolve: {
    log$(qsFromLocation: qsFromLocationT, $stateParams: Object) {
      'ngInject';
      const qsFromLocationToOld = fp.flow(
        qsFromLocation,
        statusQsToOldQsParser
      );

      let qs = qsFromLocationToOld($stateParams);

      if (qs.length) qs = `?${qs}`;

      const $ = store.select('server').zip(socketStream(`/log/${qs}`));

      return resolveStream($.map(fp.flow(addHostIds, addCurrentPage)));
    }
  },
  component: 'logTable'
};
