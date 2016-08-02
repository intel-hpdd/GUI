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

// @flow

import resolveStream from '../resolve-stream.js';
import socketStream from '../socket/socket-stream.js';
import statusQsToOldQsParser from './status-qs-to-old-qs-parser.js';
import parserPermutations from '../parser-permutations.js';

import * as fp from 'intel-fp';

export const statusState = {
  name: 'app.status',
  data: {
    helpPage: 'status_page.htm',
    anonymousReadProtected: true,
    eulaState: true,
    skipWhen: fp.eq
  },
  template: `
  <h3 class="page-header"><i class="fa fa-tachometer"></i> Status</h3>
  <div class="status container container-full">
    <ui-view></ui-view>
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
  resolve: {
    notification$ (qsFromLocation) {
      'ngInject';

      const qsFromLocationToOld = fp.flow(
        qsFromLocation,
        statusQsToOldQsParser
      );

      var qs = qsFromLocationToOld();

      if (qs.length)
        qs = '?' + qs;

      return resolveStream(socketStream('/alert/' + qs));
    }
  },
  component: 'statusRecords'
};
