// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from "highland";
import Backoff from "backo";
import global from "../global.js";
import { SSE } from "../environment.js";
import getStore from "../store/get-store.js";
import { SET_DISCONNECT_SSE, SET_CONNECT_SSE } from "../disconnect-modal/disconnect-modal-reducer.js";

const backoff = new Backoff({ min: 100, max: 20000 });

let token;

export default () =>
  highland((push, next) => {
    const sse = new global.EventSource(SSE);

    sse.onopen = () => {
      clearTimeout(token);
      backoff.reset();
      getStore.dispatch({
        type: SET_CONNECT_SSE,
        payload: {}
      });
    };

    sse.onerror = e => {
      // pass errors along but don't end the stream
      if (e.currentTarget.readyState === 0 || e.currentTarget.readyState === 2) {
        getStore.dispatch({
          type: SET_DISCONNECT_SSE,
          payload: {}
        });

        token = setTimeout(() => {
          sse.onopen = null;
          sse.onerror = null;
          sse.onmessage = null;
          sse.close();

          next();
        }, backoff.duration());
      } else {
        push(new Error("An error occurred while the server send event was connected."));
      }
    };

    sse.onmessage = (msg: SSEEventT) => {
      try {
        const data = JSON.parse(msg.data);
        push(null, data);
      } catch (e) {
        push(e);
      }
    };
  });
