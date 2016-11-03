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

type eventSocketsT = {
  [key:number]:EventSocket
};

type messageT = {
  type:string,
  id:number,
  payload?:mixed,
  ack?:boolean
};

const eventSockets:eventSocketsT = {};

// $FlowFixMe Track: https://github.com/facebook/flow/pull/2680
socketWorker.addEventListener('message', (ev:{data:Object}) => {
  const data:Object = ev.data;

  if (!data.id)
    return;

  if (!eventSockets[data.id])
    return;

  var eventSocket = eventSockets[data.id];

  eventSocket.emit(data.type, data.payload);
}, false);

class EventSocket extends EventEmitter {
  id:number;
  constructor(id:number) {
    super();
    this.id = id;
  }
  connect () {
    if (eventSockets[this.id])
      return;

    eventSockets[this.id] = this;

    socketWorker.postMessage({
      type: 'connect',
      id: this.id
    });
  }
  end () {
    if (!eventSockets[this.id])
      return;

    socketWorker.postMessage({
      type: 'end',
      id: this.id
    });

    eventSockets[this.id].removeAllListeners();

    delete eventSockets[this.id];
  }
  send (payload:?mixed, ack?:(resp:any) => void) {
    var message:messageT = {
      type: 'send',
      id: this.id
    };

    if (payload)
      message.payload = payload;

    if (ack) {
      message.ack = true;
      this.once('message', (resp:Object) => {
        // $FlowFixMe: already guarded by if block above.
        ack(resp);
      });
    }

    socketWorker.postMessage(message);
  }
}

export default () => {
  const id = getRandomValue();
  return new EventSocket(id);
};
