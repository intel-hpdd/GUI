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


import EventEmitter from '../event-emitter.js';
import getRandomValue from '../get-random-value.js';
import socketWorker from './socket-worker.js';

const eventSockets = {};

socketWorker.addEventListener('message', ev => {
  if (!ev.data.id)
    return;

  if (!eventSockets[ev.data.id])
    return;

  var eventSocket = eventSockets[ev.data.id];

  eventSocket.emit(ev.data.type, ev.data.payload);
}, false);

export default function getEventSocket () {
  var id = getRandomValue();

  var emitter = new EventEmitter();
  var eventSocket = Object.create(emitter);

  eventSocket.connect = function connect () {
    if (eventSockets[id])
      return;

    eventSockets[id] = eventSocket;

    socketWorker.postMessage({
      type: 'connect',
      id: id
    });
  };

  eventSocket.end = function end () {
    if (!eventSockets[id])
      return;

    socketWorker.postMessage({
      type: 'end',
      id: id
    });

    eventSockets[id].removeAllListeners();

    delete eventSockets[id];

    eventSocket = emitter = null;
  };

  type messageT = {
    type: string,
    id: number,
    payload?: mixed,
    ack?: boolean
  };

  eventSocket.send = function send (payload:mixed, ack?:Function) {
    var message:messageT = {
      type: 'send',
      id
    };

    if (payload)
      message.payload = payload;

    if (ack && eventSocket) {
      message.ack = true;
      eventSocket.once('message', function messageHandler (resp:mixed) {
        // $FlowIgnore: already guarded by if block above.
        ack(resp);
      });
    }

    socketWorker.postMessage(message);
  };

  return eventSocket;
}
