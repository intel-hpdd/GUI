// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import getWebWorker from "./get-web-worker.js";

import { STATIC_URL } from "../environment.js";
import getStore from "../store/get-store.js";
import { SET_CONNECT_REALTIME, SET_DISCONNECT_REALTIME } from "../disconnect-modal/disconnect-modal-reducer.js";

const worker = getWebWorker(`${STATIC_URL}node_modules/socket-worker/dist/bundle.js`);

// $FlowFixMe Track: https://github.com/facebook/flow/pull/2680
worker.addEventListener("message", (ev: { data: Object }) => {
  const data = ev.data;

  if (data.type === "reconnecting")
    getStore.dispatch({
      type: SET_DISCONNECT_REALTIME,
      payload: {}
    });

  if (data.type === "reconnect")
    getStore.dispatch({
      type: SET_CONNECT_REALTIME,
      payload: {}
    });
});

// $FlowFixMe No way to specify error events currently.
worker.addEventListener("error", (err: Error) => {
  throw err;
});

export default worker;
