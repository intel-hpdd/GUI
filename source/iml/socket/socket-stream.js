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

import * as fp from '@mfl/fp';
import highland from 'highland';
import getEventSocket from '../socket-worker/get-event-socket.js';
import buildResponseError from './build-response-error.js';

import type { HighlandStreamT } from 'highland';

type errorRespT = {
  error?: { [key: string]: string }
};

export default function sendRequest<B>(
  path: string,
  options: Object = {},
  isAck: boolean = false
): HighlandStreamT<B> {
  const socket = getEventSocket();

  socket.connect();

  const data = {
    path: path.replace(/^\/?api/, ''),
    options
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
    const s: HighlandStreamT<B & errorRespT> = highland(
      'message',
      socket
    ).onDestroy(end);
    stream = s.map((response): B => {
      const error = response.error;

      if (error) throw buildResponseError(error);

      return response;
    });
  }

  return stream;
}
