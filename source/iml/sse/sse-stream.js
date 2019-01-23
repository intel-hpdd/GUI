// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from "highland";
import global from "../global.js";
import { SSE } from "../environment.js";

const sse = new global.EventSource(SSE);

export default () =>
  highland(push => {
    sse.onerror = (e: Error) => {
      // pass errors along but don't end the stream
      push(e);
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
