// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {noop} from 'intel-fp';
import highland from 'highland';
import getEventSocket from '../socket-worker/get-event-socket.js';
import buildResponseError from './build-response-error.js';

import type {
  HighlandStreamT
} from 'highland';

type apiResponseT = {
  objects:Array<Object>
};

type errorRespT = {
  error?:{ [key: string]: string }
};

type apiResponseWithErrorT = (apiResponseT & errorRespT);

export default function sendRequest (path:string, options:Object = {}, isAck:boolean = false) {
  var socket = getEventSocket();

  socket.connect();

  const data = {
    path: path.replace(/^\/?api/, ''),
    options
  };

  var end = socket.end.bind(socket);

  var stream:HighlandStreamT<apiResponseT>;
  if (isAck) {
    stream = highland(push => {
      socket.send(data, function ack (response:apiResponseWithErrorT) {
        const error = (response != null) && response.error;

        if (error)
          push(buildResponseError(error));
        else
          push(null, response);

        if (stream.paused)
          stream.emit('end');

        push(null, highland.nil);
      });
    });

    stream.once('end', end);
    stream.on('error', noop);
  } else {
    socket.send(data);
    const s:HighlandStreamT<apiResponseWithErrorT> = highland('message', socket)
      .onDestroy(end);
    stream = s.map((response):apiResponseT => {
      const error = response.error;

      if (error)
        throw buildResponseError(error);

      return response;
    });
  }

  return stream;
}
