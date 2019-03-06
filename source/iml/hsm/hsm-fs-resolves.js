// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";

import socketStream from "../socket/socket-stream.js";
import broadcaster from "../broadcaster.js";
import store from "../store/get-store.js";

import { resolveStream, streamToPromise } from "../promise-transforms.js";

export function fsCollStream() {
  return resolveStream(
    socketStream("/filesystem", {
      jsonMask: "objects(content_type_id,id,label,cdt_status,hsm_control_params)"
    })
  ).then(
    fp.flow(
      s => s.map(x => x.objects),
      broadcaster
    )
  );
}

export const getData = ($stateParams: { fsId?: string }) => {
  "ngInject";
  if ($stateParams.fsId) {
    const id = Number.parseInt($stateParams.fsId);

    const find = xs => xs.find(x => x.id === id);

    return streamToPromise(store.select("fileSystems").map(find));
  } else {
    return Promise.resolve({ label: null });
  }
};
