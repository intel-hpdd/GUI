// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import getStore from "./store/get-store.js";
import { SHOW_EXCEPTION_MODAL_ACTION } from "./exception/exception-modal-reducer.js";

export default function fetchApi<T>(url: string, options: Object = {}): Promise<?T> {
  const r: Promise<?T> = fetch(url, options)
    .then(x => x.json())
    .catch(e => {
      getStore.dispatch({
        type: SHOW_EXCEPTION_MODAL_ACTION,
        payload: e
      });
    });

  return r;
}
