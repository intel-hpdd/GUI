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

import parserPermutations from '../parser-permutations.js';

import socketStream from '../socket/socket-stream.js';
import resolveStream from '../resolve-stream.js';
import statusQsToOldQsParser from '../status/status-qs-to-old-qs-parser.js';
import store from '../store/get-store.js';
import multiStream from '../multi-stream.js';
import * as fp from 'intel-fp';
import {
  addHostIds
} from './log-transforms.js';

import {
  addCurrentPage
} from '../api-transforms.js';

export const logState = {
  name: 'app.log',
  data: {
    helpPage: 'logs_page.htm',
    anonymousReadProtected: true,
    eulaState: true,
    skipWhen: fp.eq
  },
  template: `
  <h3 class="page-header">
    <i class="fa fa-book"></i> Logs
  </h3>
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
  resolve: {
    log$ (qsFromLocation:Function) {
      'ngInject';

      const qsFromLocationToOld = fp.flow(
        qsFromLocation,
        statusQsToOldQsParser
      );

      var qs = qsFromLocationToOld();

      if (qs.length)
        qs = '?' + qs;

      const m$ = multiStream([
        store
          .select('server'),
        socketStream('/log/' + qs)
      ]);

      return resolveStream(
        m$
          .map(
            fp.flow(
              addHostIds,
              addCurrentPage
            )
          )
      );
    }
  },
  component: 'logTable'
};
