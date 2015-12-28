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

import angular from 'angular';

import {__, curry} from 'intel-fp/fp';

angular.module('socket-worker')
  .factory('socketWorker', function socketWorkerFactory (getWebWorker, disconnectModal, $timeout, STATIC_URL) {
    'ngInject';

    var modal;
    var worker = getWebWorker(STATIC_URL + 'bundle.js');
    var timedOut = curry(4, $timeout)(__, 0, true);

    worker.addEventListener('message', function onMessage (ev) {
      var data = ev.data;

      var onReconnecting = timedOut(function onReconnecting () {
        if (!modal)
          modal = disconnectModal();
      });

      var onReconnect = timedOut(function onReconnected () {
        if (modal) {
          modal.close();
          modal = null;
        }
      });

      if (data.type === 'reconnecting')
        onReconnecting(undefined);

      if (data.type === 'reconnect')
        onReconnect(undefined);
    });

    worker.addEventListener('error', timedOut(function onError (err) {
      throw err;
    }));

    return worker;
  });

