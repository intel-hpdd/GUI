// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.


import EventEmitter from '../event-emitter.js';
import getRandomValue from '../get-random-value.js';
import socketWorker from './socket-worker.js';

type eventSocketsT = {
  [key: number]: EventSocket
};

type messageT = {
  type:string,
  id:number,
  payload?:mixed,
  ack?:boolean
};

const eventSockets:eventSocketsT = {};

socketWorker.addEventListener('message', ev => {
  if (!ev.data.id)
    return;

  if (!eventSockets[ev.data.id])
    return;

  var eventSocket = eventSockets[ev.data.id];

  eventSocket.emit(ev.data.type, ev.data.payload);
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
  send (payload:?mixed, ack?:(resp:Object) => void) {
    var message:messageT = {
      type: 'send',
      id: this.id
    };

    if (payload)
      message.payload = payload;

    if (ack) {
      message.ack = true;
      this.once('message', (resp:Object) => {
        // $FlowIgnore: already guarded by if block above.
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
