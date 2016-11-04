// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.


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

  const eventSocket = eventSockets[data.id];

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
    const message:messageT = {
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
