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

import {noop} from 'intel-fp';
import highland from 'highland';
import getEventSocket from '../socket-worker/get-event-socket.js';
import buildResponseError from './build-response-error.js';

export default function sendRequest (path:string, options:Object, isAck:boolean = false) {
  var socket = getEventSocket();

  socket.connect();

  var data = {
    path: path.replace(/^\/?api/, ''),
    options: options || {}
  };

  var end = socket.end.bind(socket);

  var stream;
  if (isAck) {
    stream = highland(push => {
      socket.send(data, function ack (response) {
        if ('error' in response)
          push(buildResponseError(response));
        else
          push(null, response);

        if (stream.paused)
          stream.emit('end');
        else
          push(null, highland.nil);
      });
    });

    stream.once('end', end);
    stream.on('error', noop);
  } else {
    socket.send(data);
    stream = highland('message', socket)
      .map(response => {
        if ('error' in response)
          throw buildResponseError(response);

        return response;
      });

    stream._destructors.push(end);
  }

  return stream;
}
