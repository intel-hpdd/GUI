// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';
import highland from 'highland';
import getEventSocket from '../socket-worker/get-event-socket.js';
import buildResponseError from './build-response-error.js';

import type { HighlandStreamT } from 'highland';

type errorRespT = {
  error?: { [key: string]: string }
};

export default function sendRequest<B>(path: string, options: Object = {}, isAck: boolean = false): HighlandStreamT<B> {
  const socket = getEventSocket();

  socket.connect();

  const data = {
    path: path.replace(/^\/?api/, ''),
    options: {
      method: 'get',
      ...options
    }
  };

  const end = socket.end.bind(socket);

  let stream: HighlandStreamT<B>;
  if (isAck) {
    stream = highland(push => {
      socket.send(data, function ack(response: B & errorRespT) {
        const error = response != null && response.error;

        if (error) push(buildResponseError(error));
        else push(null, response);

        if (stream.paused) stream.emit('end');

        push(null, highland.nil);
      });
    });

    stream.once('end', end);
    stream.on('error', fp.noop);
  } else {
    socket.send(data);
    const s: HighlandStreamT<B & errorRespT> = highland('message', socket).onDestroy(end);
    stream = s.map(
      (response): B => {
        const error = response.error;

        if (error) throw buildResponseError(error);

        return response;
      }
    );
  }

  return stream;
}
