// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import parserPermutations from '../parser-permutations.js';

import socketStream from '../socket/socket-stream.js';
import statusQsToOldQsParser from '../status/status-qs-to-old-qs-parser.js';
import store from '../store/get-store.js';
import * as fp from '@iml/fp';

import { resolveStream } from '../promise-transforms.js';

import { addHostIds } from './log-transforms.js';

import { addCurrentPage } from '../api-transforms.js';

import { multiStream2 } from '../multi-stream.js';

import { tzPickerB } from '../tz-picker/tz-picker-resolves.js';

import type { qsFromLocationT } from '../qs-from-location/qs-from-location-module.js';

import type { HighlandStreamT } from 'highland';

export const logState = {
  name: 'app.log',
  data: {
    helpPage: 'Graphical_User_Interface_9_0.html#9.5',
    anonymousReadProtected: true
  },
  resolve: { tzPickerB },
  component: 'logQuery'
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

      const $: HighlandStreamT<[Object[], Object]> = multiStream2([store.select('server'), socketStream(`/log/${qs}`)]);

      return resolveStream(
        $.map(
          fp.flow(
            addHostIds,
            addCurrentPage
          )
        )
      );
    },
    tzPickerB
  },
  component: 'logTable'
};
