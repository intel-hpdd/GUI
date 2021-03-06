//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import socketStream from "../socket/socket-stream.js";

export default function getCopytoolStream(params) {
  params = Object.assign(
    {},
    {
      qs: {
        limit: 0
      },
      jsonMask:
        "objects(content_type_id,id,label,host/label,archive,state,\
active_operations_count,available_actions,resource_uri)"
    },
    params || {}
  );

  const viewLensProp = fp.flow(
    fp.lensProp,
    fp.view
  );
  const statusLens = fp.lensProp("status");
  const viewStateLens = viewLensProp("state");

  const setStatus = fp.cond(
    [
      fp.flow(
        fp.eqFn(fp.identity)(viewStateLens)("started"),
        fp.not
      ),
      x => fp.set(statusLens)(viewStateLens(x))(x)
    ],
    [fp.eqFn(fp.identity)(viewLensProp("active_operations_count"))(0), fp.set(statusLens)("idle")],
    [fp.always(true), fp.set(statusLens)("working")]
  );

  const setStatuses = fp.map(
    fp.flow(
      viewLensProp("objects"),
      fp.over(fp.mapped)(setStatus)
    )
  );

  return socketStream("/copytool", params).through(setStatuses);
}
