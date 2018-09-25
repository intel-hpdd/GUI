// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { State } from "./storage-reducer.js";
import type { StorageResourceClass } from "./storage-types.js";

import store from "../store/get-store.js";
import socketStream from "../socket/socket-stream.js";

import { canDispatch } from "../dispatch-source-utils.js";

import { flow } from "@iml/fp";
import { addStorageResourceClasses, setStorageSelectIndex } from "./storage-actions.js";

if (canDispatch()) {
  socketStream("/storage_resource_class", {
    qs: {
      plugin_internal: false,
      limit: 0
    }
  })
    .map((x: { objects: StorageResourceClass[] }) => x.objects)
    .each(
      flow(
        addStorageResourceClasses,
        store.dispatch
      )
    );

  store
    .select("storage")
    .map((x: State): ?(StorageResourceClass[]) => x.resourceClasses)
    .filter(Array.isArray)
    .pull((err, xs) => {
      if (err) throw err;

      // $FlowFixMe: This will never be null
      let index = xs.findIndex(x => x.user_creatable);
      index = index === -1 ? 0 : index;

      store.dispatch(setStorageSelectIndex(index));
    });
}
