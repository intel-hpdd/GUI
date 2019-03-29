// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import getStore from "./store/get-store.js";
import global from "./global.js";
import { SHOW_EXCEPTION_MODAL_ACTION } from "./exception/exception-modal-reducer.js";

export default function fetchApi<T>(url: string, options: Object = {}): Promise<T> {
  const r: Promise<T> = global
    .fetch(url, options)
    .then(async x => {
      const { status, ok } = x;

      if (!ok)
        return {
          status,
          ok,
          json: null
        };

      const json = await x.json();

      return {
        status,
        ok,
        json
      };
    })
    .catch(e => {
      getStore.dispatch({
        type: SHOW_EXCEPTION_MODAL_ACTION,
        payload: e
      });
    });

  return r;
}
