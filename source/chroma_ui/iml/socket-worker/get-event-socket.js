//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2014 Intel Corporation All Rights Reserved.
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

angular.module('socket-worker')
  .value('EventEmitter', Object.getPrototypeOf(Object.getPrototypeOf(highland())).constructor)
  .factory('getEventSocket', ['socketWorker', 'getRandomValue', 'EventEmitter',
    function getEventSocketFactory (socketWorker, getRandomValue, EventEmitter) {
      'use strict';

      var eventSockets = {};

      socketWorker.addEventListener('message', function messageHandler (ev) {
        if (!ev.data.id)
          return;

        if (!eventSockets[ev.data.id])
          return;

        var eventSocket = eventSockets[ev.data.id];

        eventSocket.emit(ev.data.type, ev.data.payload);
      }, false);

      return function getEventSocket () {
        var id = getRandomValue();

        var emitter = new EventEmitter();
        var eventSocket = Object.create(emitter);

        eventSocket.connect = function connect () {
          if (eventSockets[id])
            return;

          eventSockets[id] = eventSocket;

          socketWorker.postMessage({ type: 'connect', id: id });
        };

        eventSocket.end = function end () {
          if (!eventSockets[id])
            return;

          socketWorker.postMessage({ type: 'end', id: id });

          eventSockets[id].removeAllListeners();

          delete eventSockets[id];

          eventSocket = emitter = null;
        };

        eventSocket.send = function send (payload, ack) {
          var message = { type: 'send', id: id };

          if (payload)
            message.payload = payload;

          if (ack) {
            message.ack = true;
            eventSocket.once('message', function messageHandler (resp) {
              ack(resp);
            });
          }

          socketWorker.postMessage(message);
        };

        return eventSocket;
      };
    }
  ]);
