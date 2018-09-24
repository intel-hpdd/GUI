// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { StorageResourceClass } from "./storage-types.js";

import Inferno from "inferno";
import store from "../store/get-store.js";
import { setStorageSelectIndex, setStorageTableLoading } from "./storage-actions.js";

const handleChange = ev => {
  const select = ev.target;
  store.dispatch(setStorageSelectIndex(select.selectedIndex));
  store.dispatch(setStorageTableLoading(true));
};

export default ({ classes, idx }: { classes: StorageResourceClass[], idx: number }) => (
  <div class="form-group well">
    <label class="control-label">Select Resource Class</label>
    <select class="form-control" onChange={handleChange}>
      {classes.map((x, i) => (
        <option
          key={`${x.class_name},${x.plugin_name}`}
          value={`${x.class_name},${x.plugin_name}`}
          selected={i === idx}
        >
          {x.label}
        </option>
      ))}
    </select>
  </div>
);
