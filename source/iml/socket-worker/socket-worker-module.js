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
import cryptoModule from '../crypto/crypto-module';
import disconnectModalModule from '../disconnect-modal/disconnect-modal-module';
import {EventEmitter, getEventSocketFactory} from './get-event-socket';
import socketWorkerFactory from './socket-worker';

export default angular
  .module('socket-worker', [cryptoModule, disconnectModalModule])
  .value('getWebWorker', function getWebWorkerFactory (url) {
    return new Worker(url);
  })
  .value('EventEmitter', EventEmitter)
  .factory('getEventSocket', getEventSocketFactory)
  .factory('socketWorker', socketWorkerFactory)
  .name;
