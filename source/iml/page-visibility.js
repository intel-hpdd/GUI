// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

import global from './global.js';

export default function pageVisibility (onHide:Function, onShow:Function, timeout:number = 0):Function {
  let id;

  const setCancelled = () => {
    id = setTimeout(() => {
      id = null;
      onHide();
    }, timeout);
  };

  const cancelTimeout = () => {
    let shouldClear = id != null;

    if (shouldClear)
      global.clearTimeout(id);

    id = null;

    return shouldClear;
  };

  const onVisibilityChange = fp.cond(
    [() => global.document.hidden, setCancelled],
    [fp.flow(cancelTimeout, fp.not), onShow]
  );

  global.document.addEventListener('visibilitychange', onVisibilityChange);

  return () => {
    cancelTimeout();
    global.document.removeEventListener('visibilitychange', onVisibilityChange);
  };
}
