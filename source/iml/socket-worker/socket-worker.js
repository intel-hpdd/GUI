// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import getWebWorker from './get-web-worker.js';
import disconnectListener from '../disconnect-modal/disconnect-listener.js';
import {STATIC_URL} from '../environment.js';

const worker = getWebWorker(`${STATIC_URL}node_modules/intel-socket-worker/dist/bundle.js`);

worker.addEventListener('message', ev => {
  const data = ev.data;

  if (data.type === 'reconnecting')
    disconnectListener.emit('open');

  if (data.type === 'reconnect')
    disconnectListener.emit('close');
});

worker.addEventListener('error', err => {
  throw err;
});

export default worker;
